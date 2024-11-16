import { Button, ButtonGroup } from "@nextui-org/button";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { RxMagnifyingGlass } from "react-icons/rx";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys.js";
import { FaBookBookmark } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { div } from "framer-motion/client";
import { SidebarListExercise } from "../components/sidebar-listexercise.jsx";

const ListCard = [
	{
		name: "Câu hỏi trắc nghiệm tiếng anh",
		collectionname: "Phần 1",
		view: 300,
		download: 500,
	},
	{
		name: "Câu hỏi trắc nghiệm tiếng anh",
		collectionname: "Phần 1",
		view: 300,
		download: 500,
	},
	{
		name: "Câu hỏi trắc nghiệm tiếng anh",
		collectionname: "Phần 1",
		view: 300,
		download: 500,
	},
	{
		name: "Câu hỏi trắc nghiệm tiếng anh",
		collectionname: "Phần 1",
		view: 300,
		download: 500,
	},
];

const ListExercise = () => {
	const [formValue, setFormValue] = useState({
		courseLevelId: "",
	});

	const handleOpenFileSelect = () => {
		console.log(inputFileRef.current.click());
	};

	const levelCourseQuery = useQuery({
		queryKey: [queryKeys.levelCourse, formValue.targetLanguageId],
		queryFn: async ({ queryKey }) => {
			try {
				const data =
					await CourseLevelService.fetchCourseLevelByLanguage(
						queryKey[1],
					);
				return data;
			} catch (error) {
				console.error(error);
			}
		},
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormValue({
			...formValue,
			[name]: value,
		});
	};
	const handleCancel = () => {
		console.log("Profile edit canceled");
	};

	return (
		<div className='flex '>
			<div className='flex flex-col '>
				<div className='flex mt-3 gap-3 ml-2'>
					<Button className='px-8 '>Thêm mới</Button>

					<Input
						type='text'
						radius='sm'
						placeholder=' Tìm kiếm'
						className='col-span-2 row-start-2 border-spacing-2 '
						endContent={
							<RxMagnifyingGlass className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6' />
						}
						onChange={handleInputChange}
					/>

					<Select
						classNames={{
							label: "text-sm",
						}}
						selectedKeys={[formValue.courseLevelId]}
						size='xs'
						label='cấp độ'
						radius='sm'
						isRequired
						value={formValue.courseLevelId}
						onChange={handleInputChange}
						name='ourseLevelId'>
						{levelCourseQuery.data?.levelCourses?.map(
							(levelCourse) => (
								<SelectItem
									// className='py-1'
									key={levelCourse?.[
										"course level id"
									]?.toString()}
									value={levelCourse?.[
										"course level id"
									]?.toString()}>
									{levelCourse["course level name"]}
								</SelectItem>
							),
						)}
					</Select>
				</div>
				<div className='py-4 grid xl:grid-cols-3 gap-8 lg:grid-cols-2 sm:grid-cols-1'>
					{ListCard.map((item, index) => (
						<div
							key={index}
							className='bg-white border-2 rounded-md p-2 '>
							<div className='flex flex-col gap-2 ml-2'>
								<p className='text-blue-300 text-2xl'>
									{item.name}
								</p>
								<div className='flex gap-2 mb-2'>
									<FaBookBookmark />
									<p>{item.collectionname}</p>
								</div>
							</div>
							<hr className=' bg-black' />
							<div className='flex flex-col '>
								<div className='flex gap-20 mt-2 ml-2'>
									<div className='flex gap-2 items-center'>
										 <FaEye />
										<p>{item.view}</p>
									</div>
									<div className='flex gap-2 items-center '>
										<IoMdDownload />
										<p>{item.download}</p>
									</div>
								</div>
								<div className='flex gap-14 items-center m-2'>
									<Button
										type='button'
										onClick={handleCancel}>
										Xoá
									</Button>
									<Button>Sửa</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default ListExercise;
