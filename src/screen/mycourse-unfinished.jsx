import React, { useState, useEffect, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

const UnfinishedCourse = () => {
	const { translation } = useContext(TranslationContext);
	const { updateUserState } = useContext(GlobalStateContext);
	const [courses, setCourses] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedCourseId, setSelectedCourseId] = useState(null);

	const user = useRecoilValue(userState);

	const navigate = useNavigate();

	const { data, isPending, isLoading, isRefetching } = useQuery({
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

	// Delete course
	const { mutate: deleteCourse, isLoading: isDeleting } = useMutation({
		mutationFn: async () => {
			const data = await CourseService.deleteOwnCourse(selectedCourseId, user, updateUserState);
			return { ...data, selectedCourseId };
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
		<div className='container max-w-screen-xl py-10 px-4 mt-15 bg-gray-100'>
			<div className='max-w-xl mt-10'>
				{isPending || isLoading || isRefetching ? (
					<p className='text-center text-gray-500'>Loading...</p>
				) : courses.length > 0 ? (
					courses.map((item, index) => (
						<div key={index} className='bg-white rounded-lg p-4 shadow-lg border'>
							<div className='flex'>
								{/* Left Section: Image */}
								<div className='flex-shrink-0'>
									<Image
										alt='course thumbnail'
										src={item["image"]}
										className='w-40 h-40 rounded-lg object-cover'
									/>
								</div>

								{/* Right Section: Content */}
								<div className='flex-grow pl-6'>
									<div className='flex mt-4'>
										<h3 className='text-lg font-semibold text-gray-800 mb-2'>{item["name"]}</h3>
										<div>
											<Popover>
												<PopoverTrigger>
													<Button
														isIconOnly
														className='bg-white border-0'
														aria-label='Options'>
														<BsThreeDots className='text-large ml-4' />
													</Button>
												</PopoverTrigger>

												<PopoverContent>
													<div className='flex flex-col py-2'>
														<button
															onClick={() => openDeleteModal(item["course id"])}
															className='px-4 py-2 text-left hover:bg-gray-100 text-gray-700'>
															Quit
														</button>
													</div>
												</PopoverContent>
											</Popover>
										</div>
									</div>

									<div className='flex items-center text-gray-500 text-sm mb-4'>
										<div className='flex items-center mr-4'>
											<FaBookBookmark className='mr-2' />
											{item["totalWords"]}
										</div>
										<div className='flex items-center mr-4'>
											<BsFillPeopleFill className='mr-2' />
										</div>
										<div className='flex items-center'>
											<FaTrophy className='mr-2' />
											{item["course level name"]}
										</div>
									</div>

									{/* Progress Bar */}
									<div className='relative mb-4'>
										<Progress
											color='warning'
											aria-label='Loading progress'
											value={item?.["learntWords"]}
											minValue={0}
											maxValue={item?.["totalWords"]}
											className='max-w-2xl'
										/>
										<div className='flex justify-between text-sm text-gray-500 mt-1'>
											<span>Score: {item["points"]}</span>
											<span>
												Learn: {item["learntWords"]}/{item["totalWords"]}
											</span>
										</div>
									</div>

									{/* Author Info & Button */}
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Avatar src={item["avatar image"]} />
											<div>
												<p className='text-sm ml-3 font-semibold text-gray-800'>
													{item["username"]}
												</p>
												<p className='text-xs ml-3 text-gray-500'>Author</p>
											</div>
										</div>
										<Button
											className='px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600'
											endContent={<MdOutlineKeyboardDoubleArrowRight />}
											onClick={() => navigate(`${pathname.learn}?ci=${item["course id"]}`)}>
											Continue
										</Button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<p className='text-center text-gray-500'></p>
				)}
			</div>

			{/* Modal for deletion confirmation */}
			<Modal isOpen={isModalVisible} onClose={cancelDelete}>
				<ModalContent>
					<ModalHeader>Confirm Deletion</ModalHeader>
					<div className='p-4 text-gray-700'>
						Are you sure you want to quit this course? This action cannot be undone.
					</div>
					<ModalFooter>
						<Button className='bg-gray-500 text-white' onClick={cancelDelete}>
							Cancel
						</Button>
						<Button className='bg-red-500 text-white' onClick={confirmDelete} isLoading={isDeleting}>
							Quit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
};

export default UnfinishedCourse;
