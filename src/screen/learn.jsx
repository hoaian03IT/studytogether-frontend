import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Progress, Tooltip } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaRegLightbulb } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { TranslationContext } from "../components/providers/TranslationProvider.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LearnProcessService } from "../apis/learn-process.api.js";
import { toast } from "react-toastify";
import { IoIosArrowForward } from "react-icons/io";
import clsx from "clsx";
import { MultipleChoiceExercise } from "../components/multiple-choices.jsx";
import { WordDefinition } from "../components/word-definition.jsx";
import { TextQuiz } from "../components/text-quiz.jsx";

function LearnPage() {
	const user = useRecoilValue(userState);
	const { search } = useLocation();
	const queries = new URLSearchParams(search);

	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const [rd, setRd] = useState(0); // sinh so ngau nhien => bat buoc child component phai render khi la 1 prop
	const [collections, setCollections] = useState([]);
	const [unitPoint, setUnitPoint] = useState(0);
	const [questions, setQuestions] = useState([]);
	const [question, setQuestion] = useState(null);
	const [whitelist, setWhitelist] = useState([]);
	const [currentPoints, setCurrentPoints] = useState(0);
	const [nextable, setNextable] = useState(false);
	const [wrongWords, setWrongWords] = useState([]);
	const [progress, setProgress] = useState({
		current: 0, total: 0,
	});
	const [isCorrect, setIsCorrect] = useState(true);

	const navigate = useNavigate();

	const learnNewWordSessionQuery = useQuery({
		queryKey: [user.info?.username, queries.get("ci")],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await LearnProcessService.fetchLearnNewWordSession(queryKey[1], user, updateUserState);
				setUnitPoint(data?.["unitPoint"]);
				const rawCollections = [...data?.["returns"]];
				setCollections([...rawCollections]);

				// khoi tao tien trinh hoc tam thoi
				let totalScreen = rawCollections.reduce((prev, cur) => prev + cur?.screens?.length, 0);
				setProgress({ total: totalScreen, current: 0 });
				return rawCollections;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!user.info.username,
	});

	const updateLearnNewWordProgressMutation = useMutation({
		mutationFn: async (payload) => {
			return await LearnProcessService.updateLearnNewWordSession(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			console.log(data);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response?.data?.errorCode));
		},
	});

	const handleAddQuestionsFromNewCollection = (currentQuestions = []) => {
		let tmpCollections = collections;
		let randomCollectionIndex = Math.floor(Math.random() * tmpCollections.length);
		let [selectedCollection] = tmpCollections.splice(randomCollectionIndex, 1);
		let screens = selectedCollection?.screens;
		let definitionScreenIndex = screens?.findIndex(item => item?.template === "definition");

		setQuestion(...screens.splice(definitionScreenIndex, 1));
		setQuestions(currentQuestions.concat(screens));
		setCollections(tmpCollections);
	};

	useEffect(() => {
		if (collections.length > 0) {
			handleAddQuestionsFromNewCollection([]);
		}
	}, [collections]);

	useEffect(() => {
		if (!isCorrect) {
			setQuestions(prev => prev.concat(questions));
		} else {
			setProgress(prev => ({ ...prev, current: prev.current + 1 }));
		}
	}, []);

	const handleCalculatePoints = () => {
		if (isCorrect && !question?.isWrong) {
			setCurrentPoints(prev => prev + unitPoint);
		}
	};

	const handleCheckResult = (isCorrect) => {
		setNextable(true);
		setIsCorrect(isCorrect);
	};

	const handleToggleMarkDown = (wordId) => {
		if (!whitelist.includes(wordId))
			setWhitelist(prev => [...prev, wordId]);
		else {
			setWhitelist(prev => prev.filter(item => item !== wordId));
		}
	};

	const handleUpdateProgress = useCallback(() => {
		let words = learnNewWordSessionQuery.data?.map(item => {
			return {
				wordId: item?.wordId,
				isWrong: wrongWords.includes(item?.wordId),
				isRepeat: whitelist.includes(item?.wordId),
			};
		});
		updateLearnNewWordProgressMutation.mutate({ courseId: queries.get("ci"), words, points: currentPoints });
	}, [currentPoints, learnNewWordSessionQuery.data, queries, updateLearnNewWordProgressMutation, whitelist, wrongWords]);

	const handleProgress = () => {
		if (isCorrect)
			setProgress(prev => ({ ...prev, current: prev.current + 1 }));
	};

	const handleNext = () => {
		handleCalculatePoints();
		handleProgress();
		setRd(prev => prev + 1); // random bắt buộc các child component có prop là rd phải re-render
		setNextable(false);

		if (questions.length === 0) {
			setQuestion(null);
			handleUpdateProgress();
			return;
		}

		let tmpQuestions = [...questions];
		if (!isCorrect) {
			tmpQuestions.push({ ...question, isWrong: true });
			setWrongWords(prev => prev.includes(question?.["wordId"]) ? prev : [...prev, question?.["wordId"]]);
		}

		if (tmpQuestions.length < 3 && collections.length > 0) {
			handleAddQuestionsFromNewCollection(tmpQuestions);
		} else {
			// lay cau hoi random tu list questions
			let randomQuestionIndex = Math.floor(Math.random() * tmpQuestions.length);
			setQuestion(...tmpQuestions.splice(randomQuestionIndex, 1));
			// set question con lai
			setQuestions(tmpQuestions);
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<div className="bg-primary">
				<div className="text-2xl font-bold underline container py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FaRegLightbulb className="size-8 text-white" />
							<span>English - New level</span>
						</div>
						<div>
							<Tooltip content="Exit current session" className="bg-gray-800 text-white"
									 placement="bottom"
									 offset={2}
									 radius="none"
									 closeDelay={100}>
								<button onClick={() => navigate("/course-participant")}>
									<RiCloseLine className="size-12 opacity-40" />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-200 flex-1">
				<div className="container">
					<div className="py-2">
						<div className="flex justify-between items-start gap-8">
							<div className="flex-1">
								<Progress aria-label="Loading..." size="lg" color="success" value={progress.current}
										  minValue={0}
										  maxValue={progress.total} radius="none" />
								<div className="mt-10">
									{question?.template === "definition" ?
										<WordDefinition word={question?.word}
														definition={question?.definition}
														audio={question?.pronunciation}
														image={question?.image}
														type={question?.type}
														transcript={question?.transcript}
														examples={question?.examples}
														handleCheckResult={handleCheckResult}
										/> : question?.template === "multiple-choice" ?
											<MultipleChoiceExercise question={question?.question}
																	answer={question?.answer}
																	options={question?.options}
																	pronunciation={question?.pronunciation}
																	image={question?.image}
																	handleCheckResult={handleCheckResult}
																	isCorrect={isCorrect}
																	rd={rd}
											/> : question?.template === "text" ? <TextQuiz question={question?.question}
																						   answer={question?.answer}
																						   image={question?.image}
																						   audio={question?.pronunciation}
																						   handleCheckResult={handleCheckResult}
																						   isCorrect={isCorrect}
																						   rd={rd} /> :
												<div>Other</div>}
								</div>
							</div>
							<div className="flex flex-col justify-center items-center">
								<input aria-label="point"
									   aria-labelledby="point"
									   className="w-20 h-5 rounded-sm text-center text-[10px] pointer-events-none"
									   type="text" value={currentPoints} onChange={() => {
								}} />
								{nextable ?
									<Button className="flex flex-col max-h-none h-max w-20 py-4 px-2 mt-10" radius="sm"
											onClick={handleNext}
											color="secondary"
											variant="shadow">
										<IoIosArrowForward className="size-12" />
										<span className="font-semibold text-xl">Next</span>
									</Button> :
									<Button
										className="flex flex-col max-h-none h-max w-20 py-4 px-2 mt-10 bg-warning-300"
										radius="sm"
										variant="shadow">
										<FaRegLightbulb className="size-12" />
										<span className="font-semibold text-xl">Hint</span>
									</Button>}
								<Tooltip content="Marked word will appear much in practice"
										 className="bg-gray-800 text-white text-[10px] w-40 text-center"
										 placement="bottom"
										 offset={2}
										 radius="none"
										 closeDelay={100}>
									<button className="mt-5" onClick={() => handleToggleMarkDown(question?.wordId)}>
										<FaHeart
											className={clsx("size-6 transition-all", whitelist.includes(question?.wordId) ? "text-danger" : "text-gray-400")} />
									</button>
								</Tooltip>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}

export default LearnPage;