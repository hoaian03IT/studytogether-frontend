import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@nextui-org/react";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { LoadingThreeDot } from "../components/loadings/loading-three-dot";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { queryKeys } from "../react-query/query-keys.js";

const OwnCourse = () => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const queryClient = useQueryClient();

	const [courses, setCourses] = useState([]);
	const [selectedCourseId, setSelectedCourseId] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const navigate = useNavigate();

	const { data, isPending, isLoading, isRefetching } = useQuery({
		queryKey: [queryKeys.ownCourses, user.info?.username],
		queryFn: async () => {
			try {
				let data = await CourseService.getOwnCourses(user, updateUserState);
				setCourses(data || []);
				return data;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	// Delete course
	const { mutate: deleteCourse, isLoading: isDeleting } = useMutation({
		mutationFn: async () => {
			const data = await CourseService.deleteOwnCourse(selectedCourseId, user, updateUserState);
			return { ...data, selectedCourseId };
		},
		onSuccess: (data) => {
			toast.success(translation(data?.messageCode));
			let courses = queryClient.getQueryData([queryKeys.ownCourses, user.info?.username]);
			const index = courses.findIndex((item) => item?.["course id"] === data?.selectedCourseId);
			if (index > -1) {
				courses = courses?.filter((item) => item?.["course id"] !== selectedCourseId);
				console.log(courses);

				queryClient.setQueryData([queryKeys.ownCourses, user.info?.username], courses);
			}
			setIsModalVisible(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error?.response?.data?.errorCode));
			setIsModalVisible(false);
		},
	});

	useEffect(() => {
		setCourses(data);
	}, [data]);

	const openDeleteModal = (courseId) => {
		setSelectedCourseId(courseId);
		setIsModalVisible(true);
	};

	const confirmDelete = () => {
		deleteCourse();
	};

	const cancelDelete = () => {
		setIsModalVisible(false);
		setSelectedCourseId(null);
	};

	return (
		<div className="container max-w-screen-xl py-10 px-4 mt-15 bg-gray-100">
			<h1 className="text-xl font-semibold text-gray-700 mb-10">{translation("my-owned-course.your-course")}</h1>

			{isPending || isLoading || isRefetching ? (
				<LoadingThreeDot />
			) : (
				<div className="py-4 grid xl:grid-cols-3 gap-4 lg:grid-cols-2 sm:grid-cols-1">
					{courses?.length > 0 ? (
						courses?.map((item) => {
							const formattedCourse = {
								id: item?.["course id"],
								name: item?.name,
								price: parseFloat(item?.price) > 0 ? `${parseFloat(item?.price).toFixed(1)}$` : "Free",
								image: item?.image,
								words: item?.["number words"],
								enrollments: item?.["number enrollments"],
								level: item?.["course level name"],
								avatar: item?.["avatar image"],
								author: item?.username,
								status: item?.["status"],
							};

							return (
								<div key={formattedCourse.id} className="bg-white rounded-lg p-4 shadow-medium">
									<div className="relative w-full">
										<div
											className={`absolute top-2 left-2 px-3 py-1 rounded-md text-sm font-bold z-10 ${
												formattedCourse.price === "Free"
													? "bg-green-500 text-white"
													: "bg-red-500 text-white"
											}`}>
											<p>{formattedCourse.price}</p>
										</div>
										<img
											alt="Course Thumbnail"
											src={formattedCourse.image}
											className="w-full h-48 object-cover rounded-lg"
										/>
									</div>

									<h3 className="line-clamp-1 py-2 text-lg font-semibold text-gray-800">
										{formattedCourse.name}
									</h3>
									<div className="flex flex-wrap justify-between text-slate-400 py-3">
										<div className="flex gap-2 items-center text-gray-500">
											<FaBookBookmark />
											<p>{formattedCourse.words}</p>
										</div>
										<div className="flex gap-2 items-center text-gray-500">
											<BsFillPeopleFill />
											<p>{formattedCourse.enrollments}</p>
										</div>
										<div className="flex gap-2 items-center text-gray-500">
											<FaTrophy />
											<p>{formattedCourse.level}</p>
										</div>
									</div>

									<div className="flex mt-4">
										<div>
											<Popover>
												<PopoverTrigger>
													<Button
														isIconOnly
														className="rounded-full bg-white border-0 border-gray-500 mr-4"
														aria-label="Options">
														<BsThreeDots className="text-large" />
													</Button>
												</PopoverTrigger>

												<PopoverContent>
													<div className="flex flex-col py-2">
														<button
															onClick={() =>
																navigate(`/edit-course/${item?.["course id"]}`)
															}
															className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
															{translation("my-owned-course.edit")}
														</button>
														<button
															onClick={() => openDeleteModal(formattedCourse.id)}
															className="px-4 py-2 text-left hover:bg-gray-100 text-gray-700">
															{translation("my-owned-course.delete")}
														</button>
													</div>
												</PopoverContent>
											</Popover>
										</div>

										<Button
											className="px-4 py-2 flex justify-end ml-auto bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
											endContent={<MdOutlineKeyboardDoubleArrowRight />}
											onClick={() => navigate(`/course-information/${formattedCourse.id}`)}>
											{translation("my-owned-course.start")}
										</Button>
									</div>
								</div>
							);
						})
					) : (
						<p className="text-center text-gray-500">{translation("my-owned-course.no-course")}</p>
					)}
				</div>
			)}

			{/* Modal for deletion confirmation */}
			<Modal isOpen={isModalVisible} onClose={cancelDelete}>
				<ModalContent>
					<ModalHeader>{translation("my-owned-course.confirm-delete")}</ModalHeader>
					<div className="p-4 text-gray-700">{translation("my-owned-course.delete-message")}</div>
					<ModalFooter>
						<Button className="bg-gray-500 text-white" onClick={cancelDelete}>
							{translation("my-owned-course.cancel")}
						</Button>
						<Button className="bg-red-500 text-white" onClick={confirmDelete} isLoading={isDeleting}>
							{translation("my-owned-course.delete")}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default OwnCourse;
