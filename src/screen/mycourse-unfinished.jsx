import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
	Button,
	Avatar,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	ModalBody,
} from "@nextui-org/react";
import { FaBookBookmark, FaTrophy } from "react-icons/fa6";
import { BsFillPeopleFill, BsThreeDots } from "react-icons/bs";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { Image } from "@nextui-org/image";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { queryKeys } from "../react-query/query-keys.js";
import { pathname } from "../routes/index.js";
import { EnrollmentService } from "../apis/enrollment.api.js";
import { LoadingThreeDot } from "../components/loadings/loading-three-dot.jsx";

const UnfinishedCourse = () => {
	const { translation } = useContext(TranslationContext);
	const { updateUserState } = useContext(GlobalStateContext);
	const [courses, setCourses] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedCourseId, setSelectedCourseId] = useState(null);
	const [actionModal, setActionModal] = useState(null);

	const user = useRecoilValue(userState);

	const navigate = useNavigate();

	const {
		data,
		isPending,
		isLoading,
		isRefetching,
		refetch: refreshCourses,
	} = useQuery({
		queryKey: [queryKeys.unfinishedCourses, user.info?.username],
		queryFn: async () => {
			try {
				let data = await CourseService.fetchUnfinishedCourses(user, updateUserState);
				setCourses(data?.incompleteCourses || []);
				return data;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const quitCourseMutation = useMutation({
		mutationFn: async (courseId) => {
			return await EnrollmentService.quitEnrollment(courseId, user, updateUserState);
		},
		onSuccess: (data) => {
			toast.success(translation(data?.messageCode));
			setIsModalVisible(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response?.data?.errorCode));
			setIsModalVisible(false);
		},
	});

	const restartCourseMutation = useMutation({
		mutationFn: async (courseId) => {
			return await EnrollmentService.restartEnrollment(courseId, user, updateUserState);
		},
		onSuccess: (data) => {
			toast.success(translation(data?.messageCode));
			setIsModalVisible(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response?.data?.errorCode));
			setIsModalVisible(false);
		},
	});

	const openDeleteModal = (courseId, action) => {
		setActionModal(action);
		setSelectedCourseId(courseId);
		setIsModalVisible(true);
	};

	const handleQuit = async () => {
		quitCourseMutation.mutateAsync(selectedCourseId).then(async () => {
			await refreshCourses();
		});
		// refreshCourses();
	};

	const handleRestart = () => {
		restartCourseMutation.mutateAsync(selectedCourseId).then(async () => {
			await refreshCourses();
		});
		// refreshCourses();
	};

	const cancelDelete = () => {
		setIsModalVisible(false);
		setSelectedCourseId(null);
	};

	return (
		<div className="container max-w-screen-xl py-10 px-4 mt-15 bg-gray-100">
			<div className="flex items-center justify-between flex-wrap w-full mt-10">
				{isPending || isLoading || isRefetching ? (
					<LoadingThreeDot />
				) : courses.length > 0 ? (
					courses.map((item, index) => (
						<div key={index} className="w-[48%] bg-white rounded-lg p-4 shadow-lg border">
							<div className="flex">
								{/* Left Section: Image */}
								<div className="flex-shrink-0">
									<Link to={pathname.courseInformation.split(":")[0] + item?.["course id"]}>
										<Image
											alt="course thumbnail"
											src={item["image"]}
											className="size-44 rounded-lg object-cover object-center"
										/>
									</Link>
								</div>

								{/* Right Section: Content */}
								<div className="flex-grow pl-6">
									<div className="flex items-center justify-between my-4">
										<Link to={pathname.courseInformation.split(":")[0] + item?.["course id"]}>
											<h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
												{item["name"]}
											</h3>
										</Link>
										<div>
											<Dropdown radius="sm">
												<DropdownTrigger>
													<Button
														isIconOnly
														className="bg-white border-0"
														aria-label="Options">
														<BsThreeDots className="text-large ml-4" />
													</Button>
												</DropdownTrigger>

												<DropdownMenu>
													<DropdownItem
														onClick={() => openDeleteModal(item["course id"], "quit")}
														className="rounded-small">
														{translation("my-finished-course.quit")}
													</DropdownItem>
													<DropdownItem
														onClick={() => openDeleteModal(item["course id"], "restart")}>
														{translation("my-finished-course.restart")}
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
										</div>
									</div>

									<div className="flex items-center text-gray-500 text-sm mb-4">
										<div className="flex items-center mr-4">
											<FaBookBookmark className="mr-2" />
											{item["totalWords"]}
										</div>
										<div className="flex items-center mr-4">
											<BsFillPeopleFill className="mr-2" />
											{item["number enrollments"]}
										</div>
										<div className="flex items-center">
											<FaTrophy className="mr-2" />
											{item["course level name"]}
										</div>
									</div>

									{/* Progress Bar */}
									<div className="relative mb-4">
										<Progress
											color="warning"
											aria-label="Loading progress"
											value={item?.["learntWords"]}
											minValue={0}
											maxValue={item?.["totalWords"]}
											className="max-w-2xl"
										/>
										<div className="flex justify-between text-sm text-gray-500 mt-1">
											<span>
												{translation("my-finished-course.score")}: {item["points"] || 0}
											</span>
											<span>
												{translation("my-finished-course.learnt")}: {item["learntWords"]}/
												{item["totalWords"]}
											</span>
										</div>
									</div>

									{/* Author Info & Button */}
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center">
											<Avatar src={item["avatar image"]} className="border-1 border-gray-300" />
											<div>
												<p className="text-sm ml-3 font-semibold text-gray-800">
													{item["username"]}
												</p>
												<p className="text-xs ml-3 text-gray-500">
													{translation("my-finished-course.author")}
												</p>
											</div>
										</div>
										<Button
											className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600"
											endContent={<MdOutlineKeyboardDoubleArrowRight />}
											onClick={() => navigate(`${pathname.learn}?ci=${item["course id"]}`)}>
											{translation("my-finished-course.continue")}
										</Button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<p className="text-center text-gray-500">{translation("my-finished-course.no-course")}</p>
				)}
			</div>

			{/* Modal for deletion confirmation */}
			{actionModal && (
				<Modal isOpen={isModalVisible} onClose={cancelDelete} radius="sm">
					<ModalContent>
						<ModalHeader>{translation(`course-management.title-${actionModal}-course`)}t</ModalHeader>
						<ModalBody>
							<div className="text-gray-700">
								{translation(`course-management.description-${actionModal}-course`)}
							</div>
						</ModalBody>
						<ModalFooter>
							<Button radius="sm" className="bg-gray-500 text-white" onClick={cancelDelete}>
								{translation("course-management.cancel")}
							</Button>
							<Button
								radius="sm"
								className="bg-red-500 text-white"
								onClick={
									actionModal === "quit"
										? handleQuit
										: actionModal === "restart"
										? handleRestart
										: () => {}
								}>
								{translation(`course-management.${actionModal}`)}
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			)}
		</div>
	);
};

export default UnfinishedCourse;
