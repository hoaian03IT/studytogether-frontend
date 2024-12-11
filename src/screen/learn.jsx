import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LearnProcessService } from "../apis/learn-process.api.js";
import { toast } from "react-toastify";
import { HeaderLearnProgress } from "../components/header-learn-progress.jsx";
import { ProgressBarPoint } from "../components/progress-bar-point.jsx";
import { WordDefinition } from "../components/word-definition.jsx";
import { MultipleChoiceExercise } from "../components/multiple-choices.jsx";
import { TextQuiz } from "../components/text-quiz.jsx";
import { Button, Tooltip } from "@nextui-org/react";
import { FaRegLightbulb } from "react-icons/fa";
import clsx from "clsx";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { LoadingWaitAMinute } from "../components/loadings/loading-wait-a-minute.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { pathname } from "../routes/index.js";

function LearnPage() {
	const user = useRecoilValue(userState);
	const { search } = useLocation();
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
	const [nextable, setNextable] = useState(false); // cung y nghia voi isSubmitted
	const [wrongWords, setWrongWords] = useState({});
	const [progress, setProgress] = useState({
		current: 0,
		total: 0,
	});
	const [isCorrect, setIsCorrect] = useState(true);
	const [learningLevelNames, setLearningLevelNames] = useState("");

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

				setLearningLevelNames(data?.["levelNames"].join(" - "));

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
			navigate(pathname.courseParticipant);
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
		let definitionScreenIndex = screens?.findIndex((item) => item?.template === "definition");

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
			setQuestions((prev) => prev.concat(questions));
		} else {
			setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
		}
	}, []);

	const handleCalculatePoints = () => {
		if (isCorrect && !question?.isWrong) {
			setCurrentPoints((prev) => prev + unitPoint);
		}
	};

	const handleCheckResult = (isCorrect) => {
		setNextable(true);
		setIsCorrect(isCorrect);
	};

	const handleToggleMarkDown = (wordId) => {
		if (!whitelist.includes(wordId)) setWhitelist((prev) => [...prev, wordId]);
		else {
			setWhitelist((prev) => prev.filter((item) => item !== wordId));
		}
	};

	const handleUpdateProgress = useCallback(() => {
		let words = learnNewWordSessionQuery.data?.map((item) => {
			return {
				wordId: item?.wordId,
				wrongTimes: wrongWords?.[item?.wordId] || 0,
				repeatable: whitelist.includes(item?.wordId),
			};
		});
		updateLearnNewWordProgressMutation.mutate({ courseId: queries.get("ci"), words, points: currentPoints });
	}, [
		currentPoints,
		learnNewWordSessionQuery.data,
		queries,
		updateLearnNewWordProgressMutation,
		whitelist,
		wrongWords,
	]);

	const handleProgress = () => {
		if (isCorrect) setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
	};

	const handleNext = () => {
		handleCalculatePoints();
		handleProgress();
		setRd((prev) => prev + 1); // random bắt buộc các child component có prop là rd phải re-render
		setNextable(false);

		if (questions.length === 0) {
			setQuestion(null);
			handleUpdateProgress();
			return;
		}

		let tmpQuestions = [...questions];
		if (!isCorrect) {
			tmpQuestions.push({ ...question, isWrong: true });
			setWrongWords((prev) => ({
				...prev,
				[question?.wordId]: prev.hasOwnProperty(question?.wordId) ? prev[question?.wordId] + 1 : 1,
			}));
		}

		if (tmpQuestions.length < 5 && collections.length > 0) {
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
		<div className='flex flex-col h-screen'>
			<HeaderLearnProgress page='learn' title={`Learning level: ${learningLevelNames}`} />
			<div className='bg-gray-200 h-full'>
				{learnNewWordSessionQuery?.isPending || updateLearnNewWordProgressMutation.isPending ? (
					<LoadingWaitAMinute />
				) : (
					<div className='container'>
						<div className='py-2'>
							<div className='grid grid-cols-1 gap-x-4 gap-y-12'>
								<div className='grid-rows-1 col-span-full'>
									<ProgressBarPoint
										points={currentPoints}
										progressValue={progress.current}
										progressMax={progress.total}
										progressMin={0}
									/>
								</div>
								<div className='grid-rows-2 col-span-full'>
									<div className='grid grid-cols-12 gap-4'>
										<div className='sm:col-span-10 lg:col-span-11'>
											{question?.template === "definition" ? (
												<WordDefinition
													word={question?.word}
													definition={question?.definition}
													audio={question?.pronunciation}
													image={question?.image}
													type={question?.type}
													transcript={question?.transcript}
													examples={question?.examples}
													handleCheckResult={handleCheckResult}
												/>
											) : question?.template === "multiple-choice" ? (
												<MultipleChoiceExercise
													question={question?.question}
													answer={question?.answer}
													options={question?.options}
													pronunciation={question?.pronunciation}
													image={question?.image}
													handleCheckResult={handleCheckResult}
													isCorrect={isCorrect}
													rd={rd}
												/>
											) : question?.template === "text" ? (
												<TextQuiz
													question={question?.question}
													answer={question?.answer}
													image={question?.image}
													audio={question?.pronunciation}
													handleCheckResult={handleCheckResult}
													isCorrect={isCorrect}
													rd={rd}
												/>
											) : (
												<div>Other</div>
											)}
										</div>
										<div className='sm:col-span-2 lg:col-span-1 flex flex-col items-center'>
											{nextable ? (
												<Button
													className='flex flex-col max-h-none h-max w-full py-4 px-2'
													radius='sm'
													onClick={handleNext}
													color='secondary'
													variant='shadow'>
													<IoIosArrowForward className='size-12' />
													<span className='font-semibold text-xl'>Next</span>
												</Button>
											) : (
												<Button
													className='flex flex-col max-h-none h-max w-full py-4 px-2 bg-warning-300'
													radius='sm'
													variant='shadow'>
													<FaRegLightbulb className='size-12' />
													<span className='font-semibold text-xl'>Hint</span>
												</Button>
											)}
											<Tooltip
												content='Marked word will appear much in practice'
												className='bg-gray-800 text-white text-[10px] w-40 text-center'
												placement='bottom'
												offset={2}
												radius='none'
												closeDelay={100}>
												<button
													className='mt-5'
													onClick={() => handleToggleMarkDown(question?.wordId)}>
													<FaHeart
														className={clsx(
															"size-6 transition-all",
															whitelist.includes(question?.wordId)
																? "text-danger"
																: "text-gray-400",
														)}
													/>
												</button>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default LearnPage;
