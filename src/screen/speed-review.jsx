import { HeaderLearnProgress } from "../components/header-learn-progress.jsx";
import { ProgressBarPoint } from "../components/progress-bar-point.jsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx";
import { TranslationContext } from "../components/providers/TranslationProvider.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { pathname } from "../routes/index.js";
import { MultipleChoiceExercise } from "../components/multiple-choices.jsx";
import { FaBoltLightning } from "react-icons/fa6";
import clsx from "clsx";
import { LoadingWaitAMinute } from "../components/loadings/loading-wait-a-minute.jsx";
import { TextQuiz } from "../components/text-quiz.jsx";
import { LearnProcessService } from "../apis/learn-process.api.js";

const INIT_REMAINING_CHANCES = 3;

function SpeedReview() {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	// states
	const [currentPoints, setCurrentPoints] = useState(0);
	const [unitPoint, setUnitPoint] = useState(0);
	const [collections, setCollections] = useState([]);
	const [questions, setQuestions] = useState([]);
	const [question, setQuestion] = useState(null);
	const [timeCount, setTimeCount] = useState({
		init: 0,
		remaining: 0,
	});
	const [remainingChances, setRemainingChances] = useState(INIT_REMAINING_CHANCES);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [complete, setComplete] = useState([]);

	const navigate = useNavigate();

	const { search } = useLocation();
	const queries = new URLSearchParams(search);

	const quizRef = useRef(null);
	const pronunciationRef = useRef(null);

	// timer event
	useEffect(() => {
		let remaining = timeCount.remaining;

		const handleTimeCount = () => {
			if (remaining > 0 && remainingChances > 0) {
				remaining--;
				setTimeCount(prev => ({ ...prev, remaining: remaining }));
			} else {
				clearInterval(handler);
			}
		};

		const handler = setInterval(handleTimeCount, 1000);
		return () => clearInterval(handler);
	}, [question, remainingChances]);

	// bat su kien neu nhu thoi gian con lai = 0 thi tu dong submit
	useEffect(() => {
		if (timeCount.remaining <= 0 && !isSubmitted) {
			quizRef.current?.submit();
		}
	}, [timeCount]);

	// handle update remaining chances and points
	useEffect(() => {
		if (isSubmitted && question) {
			if (!isCorrect) {
				setRemainingChances(prev => {
					 // Giữ giá trị không âm
					return Math.max(prev - 1, 0);
				});
			} else {
				setCurrentPoints(prev => prev + unitPoint);
			}
		}
	}, [isSubmitted, isCorrect]);

	// update complete progress
	useEffect(() => {
		if (isSubmitted) {
			setComplete(prev => {
				const updatedPrev = [...prev];
				const idx = updatedPrev.findIndex(item => item?.wordId === question?.wordId);
				if (idx >= 0) {
					updatedPrev[idx] = {
						...updatedPrev[idx],
						wrongTimes: isCorrect ? updatedPrev[idx].wrongTimes : updatedPrev[idx].wrongTimes + 1,
					};
				} else {
					updatedPrev.push({
						wordId: question?.wordId,
						wrongTimes: isCorrect ? 0 : 1,
					});
				}
				return updatedPrev;
			});
		}
	}, [isSubmitted]);

	// handle update next question
	useEffect(() => {
		if (isSubmitted) {
			const timeoutId = setTimeout(() => {
				if ((collections.length === 0 && questions.length === 0) || remainingChances === 0) {
					updateProgressMutation.mutate({
						courseId: queries.get("ci"),
						words: complete,
						points: currentPoints,
					});

				} else if (collections.length > 0 && questions.length === 0) {
					handleAddScreens();
				} else {
					let tmpQuestions = [...questions];
					handleNextQuestion(tmpQuestions.shift());
					setQuestions(tmpQuestions);
				}
			}, 2000);
			return () => clearTimeout(timeoutId);
		}
	}, [isSubmitted, currentPoints, complete]);

	const handleNextQuestion = (screen) => {
		setQuestion(screen);
		setTimeCount({ init: screen?.duration, remaining: screen?.duration });
		setIsSubmitted(false);
	};

	const handleAddScreens = () => {
		setCollections(prev => {

			const updatedPrev = [...prev];
			const screens = [...updatedPrev.splice(0, 1)[0].screens];

			handleNextQuestion(screens.splice(0, 1)[0]);

			setQuestions(screens);
			return updatedPrev;
		});
	};

	// call apis
	const speedReviewSessionQuery = useQuery({
		queryKey: [user.info?.username, queries.get("ci")],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await LearnProcessService.fetchSpeedReviewSession(queryKey[1], user, updateUserState);
				if (data?.returns?.length === 0) {
					navigate(pathname.courseParticipant);
					toast.info(translation("NOT_LEARN_ANY_WORD"));
					return [];
				}

				setUnitPoint(data?.["pointEachScreen"]);

				const rawCollections = [...data?.["returns"]];
				setCollections([...rawCollections]);

				handleAddScreens();

				return rawCollections;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response?.data?.errorCode));
			}
		},
		enabled: !!user.info.username,
	});

	const updateProgressMutation = useMutation({
		mutationFn: async ({ courseId, words, points }) => {
			return await LearnProcessService.updateLearnProgress({ courseId, words, points }, user, updateUserState);
		},
		onSuccess: data => {
			navigate(pathname.courseParticipant);
		},
		onError: error => {
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const handleSubmitQuiz = (isCorrect) => {
		setIsCorrect(isCorrect);
		setIsSubmitted(true);
		pronunciationRef.current.play();
	};

	return <div className="flex flex-col h-screen">
		<HeaderLearnProgress page="speed-review" title="Speed Review" />
		{speedReviewSessionQuery.isPending || updateProgressMutation.isPending ? <LoadingWaitAMinute /> :
			<div className="bg-gray-200 h-full">
				<div className="container mt-2">
					<div className="grid grid-cols-1 gap-y-12">
						<div className="grid-rows-1 col-span-full">
							<ProgressBarPoint color="danger"
											  progressMin={0}
											  progressMax={timeCount.init}
											  progressValue={timeCount.remaining}
											  points={currentPoints} />
						</div>
						<div className="grid-rows-2 col-span-full">
							<div className="flex items-center">
								{Array.from(new Array(INIT_REMAINING_CHANCES)).map((undefined, index) =>
									<FaBoltLightning
										key={index}
										className={clsx(index + 1 <= remainingChances ? "text-warning" : "text-gray-400", "animate-bounce size-6")} />)}
							</div>
						</div>
						<div className="grid-rows-3 col-span-full">
							{question?.template === "multiple-choice" ?
								<MultipleChoiceExercise ref={quizRef} question={question?.question}
														answer={question?.answer}
														image={question?.image}
														options={question?.options}
														handleCheckResult={handleSubmitQuiz} isCorrect={isCorrect} />
								: question?.template === "text" ?
									<TextQuiz ref={quizRef} question={question?.question} answer={question?.answer}
											  handleCheckResult={handleSubmitQuiz}
											  isCorrect={isCorrect} />
									: <LoadingWaitAMinute />}
							<audio ref={pronunciationRef} src={question?.pronunciation} className="hidden" />
						</div>
					</div>
				</div>
			</div>}
	</div>;
}

export default SpeedReview;