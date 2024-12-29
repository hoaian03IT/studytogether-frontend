import React, { useContext, useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { IoVolumeHigh } from "react-icons/io5";
import { queryKeys } from "../react-query/query-keys";
import { CourseService } from "../apis/course.api";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { Button } from "@nextui-org/button";
import { Avatar, Progress, Tooltip } from "@nextui-org/react";
import { TranslationContext } from "../providers/TranslationProvider";
import { VocabularyService } from "../apis/vocabulary.api";
import { FlashCardModal } from "../components/flash-cards";
import { MostPopularCourse } from "../components/most-popular";
import { LoadingThreeDot } from "../components/loadings/loading-three-dot";
import { LoadingWaitAMinute } from "../components/loadings/loading-wait-a-minute";
import { Link } from "react-router-dom";
import { pathname } from "../routes";

const FlashCard = () => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const [courses, setCourses] = useState([]);

	const [words, setWords] = useState([]);

	const [showModal, setShowModal] = useState(false);

	const enrolledCourseQuery = useQuery({
		queryKey: [queryKeys.finishedCourses],
		queryFn: async () => {
			try {
				let data = await CourseService.fetchUnfinishedCourses(user, updateUserState);
				const courses = data?.completeCourses?.concat(data?.incompleteCourses);
				setCourses(courses);
				return courses;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const learntWordMutation = useMutation({
		mutationFn: async (enrollmentId) =>
			await VocabularyService.fetchLearntWordByEnrollment(enrollmentId, user, updateUserState),
		onSuccess: (data) => {
			setWords(data?.words);
			setShowModal(true);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const markedWordMutation = useMutation({
		mutationFn: async (enrollmentId) =>
			await VocabularyService.fetchMarkedWordByEnrollment(enrollmentId, user, updateUserState),
		onSuccess: (data) => {
			setWords(data?.words);
			setShowModal(true);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	return (
		<div className="p-8">
			<h3 className="block text-blue-500 font-semibold text-2xl my-5">
				Select enrolled course to review learnt words
			</h3>
			<div className="grid grid-cols-4">
				{enrolledCourseQuery.isPending || enrolledCourseQuery.isLoading || enrolledCourseQuery.isFetching ? (
					<LoadingWaitAMinute />
				) : (
					courses?.map((item, index) => {
						return (
							<div key={index} className="bg-white rounded-lg p-4 shadow-lg border col-span-1">
								<div className="relative w-full">
									<Link to={pathname.courseInformation.split(":")[0] + item?.["course id"]}>
										<img
											alt="course thumbnail"
											src={item["image"] || "https://via.placeholder.com/150"}
											className="w-full h-48 object-cover rounded-lg"
										/>
									</Link>
								</div>
								<Link to={pathname.courseInformation.split(":")[0] + item?.["course id"]}>
									<h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800">
										{item["name"]}
									</h3>
								</Link>
								<div className="flex flex-wrap justify-between text-slate-400 py-3">
									<div className="flex gap-2 items-center text-gray-500">
										<FaBookBookmark />
										<p>{item["totalWords"]}</p>
									</div>
									<div className="flex gap-2 items-center text-gray-500">
										<BsFillPeopleFill />
										{item["number enrollments"]}
									</div>
									<div className="flex gap-2 items-center text-gray-500">
										<FaTrophy />
										<p>{item["course level name"]}</p>
									</div>
								</div>
								<div>
									<Progress
										size="md"
										minValue={0}
										maxValue={item?.["totalWords"]}
										value={item?.["learntWords"]}
									/>
								</div>
								<div className="flex mt-4">
									<div className="flex justify-start">
										<Avatar src={item["avatar image"]} />
										<div>
											<p className="text-sm ml-3 font-semibold text-gray-800">
												{item["username"]}
											</p>
											<p className="text-xs ml-3 text-gray-500">
												{translation("my-unfinished-course.author")}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center justify-end gap-2">
									<Tooltip
										placement="bottom"
										radius="sm"
										content="Create flashcards set with marked words">
										<Button
											radius="sm"
											onPress={() => learntWordMutation.mutate(item?.["enrollment id"])}
											className="px-4 py-2 flex justify-end bg-third text-white text-sm font-semibold rounded-lg shadow-md">
											All learnt
										</Button>
									</Tooltip>
									<Tooltip
										placement="bottom"
										radius="sm"
										content="Create flashcards set with all learnt words">
										<Button
											radius="sm"
											onPress={() => markedWordMutation.mutate(item?.["enrollment id"])}
											className="px-4 py-2 flex justify-end bg-secondary text-white text-sm font-semibold rounded-lg shadow-md">
											Favorite
										</Button>
									</Tooltip>
								</div>
							</div>
						);
					})
				)}
			</div>
			<FlashCardModal isOpen={showModal && words.length > 0} words={words} onClose={() => setShowModal(false)} />
			<label className="block text-blue-500 font-semibold text-2xl pt-8 pb-4">Most popular courses</label>
			<div className="grid grid-cols-3 gap-2">
				<MostPopularCourse limit="3" />
			</div>
		</div>
	);
};

export default FlashCard;
