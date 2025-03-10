import React, { useContext, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { CourseService } from "../apis/course.api.js";
import { Button, Input, Select } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { SelectItem } from "@nextui-org/select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { pathname } from "../routes/index.js";
import { LanguageService } from "../apis/language.api.js";
import { CourseLevelService } from "../apis/courseLevel.api.js";
import defaultUploadImage from "../assets/default-placeholder-upload.png";
import { queryKeys } from "../react-query/query-keys.js";
import { base64Converter } from "../utils/base64-convert.js";
import { TranslationContext } from "../providers/TranslationProvider.jsx";

const MAX_CHAR_COURSE_NAME = 100;
const MAX_CHAR_TAG = 30;
const MAX_SHORT_DESCRIPTION = 255;

const CreateCourse = () => {
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const user = useRecoilValue(userState);

	const [formValue, setFormValue] = useState({
		targetLanguageId: "",
		sourceLanguageId: "",
		courseLevelId: "",
		courseName: "",
		tag: "",
		shortDescription: "",
		detailedDescription: "",
		image: "",
	});

	const inputFileRef = useRef();

	const navigate = useNavigate();

	const languageQuery = useQuery({
		queryKey: [queryKeys.languages],
		queryFn: async () => {
			try {
				const data = await LanguageService.fetchAllLanguages();
				return data;
			} catch (error) {
				console.error(error);
			}
		},
	});

	const levelCourseQuery = useQuery({
		queryKey: [queryKeys.levelCourse, formValue.targetLanguageId],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await CourseLevelService.fetchCourseLevelByLanguage(queryKey[1]);
				return data;
			} catch (error) {
				console.error(error);
			}
		},
	});

	const courseMutation = useMutation({
		mutationFn: async () => {
			return await CourseService.createCourse(user, updateUserState, {
				courseName: formValue.courseName,
				sourceLanguageId: formValue.sourceLanguageId,
				courseLevelId: formValue.courseLevelId,
				tag: formValue.tag,
				shortDescription: formValue.shortDescription,
				detailedDescription: formValue.detailedDescription,
				image: formValue.image,
			});
		},
		onSuccess: (data) => {
			toast.success(translation(data?.messageCode));
			navigate(pathname.editCourse.split(":")[0] + data?.courseId);
			setFormValue({
				targetLanguageId: "",
				sourceLanguageId: "",
				courseLevelId: "",
				courseName: "",
				tag: "",
				shortDescription: "",
				detailedDescription: "",
				image: "",
			});
		},
		onError: (error) => {
			toast.warn(error.response.data?.errorCode);
		},
	});

	const onChangeImage = async (e) => {
		const file = e.target.files[0];
		if (file.type.split("/")[0] !== "image") {
			toast.warn("File must be an image");
			return;
		}
		let maxSize = 2; // MB
		if (file.size / (1024 * 1024) <= maxSize) {
			let { base64 } = await base64Converter(file);
			setFormValue((prev) => ({ ...prev, image: base64 }));
		} else {
			toast.warn("Image must be smaller than 2MB");
		}
	};

	const handleOpenFileSelect = () => {
		inputFileRef.current.click();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormValue({
			...formValue,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formValue.targetLanguageId === formValue.sourceLanguageId) {
			toast.warn("Ngôn ngữ học và ngôn ngữ gốc không được giống nhau!");
			return;
		}

		courseMutation.mutate();
	};

	const handleCancel = () => {
		setFormValue({
			targetLanguageId: "",
			sourceLanguageId: "",
			courseLevelId: "",
			courseName: "",
			tag: "",
			shortDescription: "",
			detailedDescription: "",
		});
		navigate(pathname.home);
	};

	return (
		<div className='bg-white px-6 rounded w-full flex flex-col items-center'>
			<h1 className='w-full text-gray-700 p-6 mt-4 bg-gradient-to-r from-blue-300 to-red-100 rounded-lg text-center text-3xl'>
				CREATE YOUR OWN
			</h1>
			<div className='max-w-screen-lg w-full'>
				<form onSubmit={handleSubmit} className='my-6 w-full grid gap-x-4 gap-y-5 grid-cols-6'>
					<div className='col-span-4 grid grid-cols-2 gap-y-5'>
						<div className='col-span-2 grid grid-cols-2 gap-4'>
							<Select
								size='lg'
								label={<Label>Native language</Label>}
								placeholder='English'
								labelPlacement='outside'
								radius='sm'
								isRequired
								name='sourceLanguageId'
								value={formValue.sourceLanguageId}
								onChange={handleInputChange}>
								{languageQuery.data?.languages?.map((language) => (
									<SelectItem
										startContent={
											<img className='size-5 rounded-full' src={language["image"]} alt='' />
										}
										className='py-3'
										key={language["language id"]}
										value={language["language id"]}>
										{language["language name"]}
									</SelectItem>
								))}
							</Select>
							<Select
								size='lg'
								label={<Label>Language to learn</Label>}
								placeholder='Tiếng Việt'
								labelPlacement='outside'
								radius='sm'
								isRequired
								name='targetLanguageId'
								value={formValue.targetLanguageId}
								onChange={handleInputChange}>
								{languageQuery.data?.languages?.map((language) => (
									<SelectItem
										startContent={
											<img className='size-5 rounded-full' src={language["image"]} alt='' />
										}
										className='py-3'
										key={language["language id"]}
										value={language["language id"]}>
										{language["language name"]}
									</SelectItem>
								))}
							</Select>
						</div>
						<Select
							size='lg'
							label={<Label>Levels</Label>}
							className='col-span-4'
							placeholder='Cấp độ'
							labelPlacement='outside'
							radius='sm'
							isRequired
							value={formValue.courseLevelId}
							onChange={handleInputChange}
							name='courseLevelId'>
							{levelCourseQuery.data?.levelCourses?.map((levelCourse) => (
								<SelectItem
									className='py-3'
									key={levelCourse["course level id"]}
									value={levelCourse["course level id"]}>
									{levelCourse["course level name"]}
								</SelectItem>
							))}
						</Select>
						<Input
							size='lg'
							name='courseName'
							type='text'
							label={<Label>Name</Label>}
							labelPlacement='outside'
							radius='sm'
							placeholder='VD: Tiếng anh lớp 6'
							value={formValue.courseName}
							onChange={(e) => {
								if (e.target.value.length <= MAX_CHAR_COURSE_NAME) {
									setFormValue((prev) => ({ ...prev, courseName: e.target.value }));
								}
							}}
							className='col-span-4'
							required
							isRequired
							endContent={
								<span className='text-sm text-gray-400'>
									{formValue.courseName.length}/{MAX_CHAR_COURSE_NAME}
								</span>
							}
						/>
						<Input
							size='lg'
							name='tag'
							type='text'
							label={<Label>Keyword</Label>}
							placeholder='VD: lớp 6'
							labelPlacement='outside'
							radius='sm'
							className='col-span-4'
							value={formValue.tag}
							onChange={(e) => {
								if (e.target.value.length <= MAX_CHAR_TAG) {
									setFormValue((prev) => ({ ...prev, tag: e.target.value }));
								}
							}}
							required
							isRequired
							endContent={
								<span className='text-sm text-gray-400'>
									{formValue.tag.length}/{MAX_CHAR_TAG}
								</span>
							}
						/>
					</div>
					<div className='col-span-2 row-span-2 flex flex-col w-full h-full'>
						<div className='-translate-y-1'>
							<Label>Image</Label>
						</div>
						<div className='flex flex-col h-full'>
							<img
								onClick={handleOpenFileSelect}
								loading='eager'
								className='flex-1 rounded-md object-cover object-center mb-2 cursor-pointer hover:bg-gray-100 transition-all'
								src={formValue.image || defaultUploadImage}
								alt=''
							/>
							<Input
								ref={inputFileRef}
								type='file'
								radius='sm'
								onChange={onChangeImage}
								multiple={false}
								accept='image/*'
								length= 'eng'
							/>
						</div>
					</div>

					<Textarea
						size='lg'
						name='shortDescription'
						type='text'
						label={<Label>Short description</Label>}
						labelPlacement='outside'
						radius='sm'
						placeholder='Viết vào ở đây...'
						className='col-span-4'
						value={formValue.shortDescription}
						onChange={(e) => {
							if (e.target.value.length <= MAX_SHORT_DESCRIPTION) {
								setFormValue((prev) => ({ ...prev, shortDescription: e.target.value }));
							}
						}}
						rows={3}
						disableAutosize
						endContent={
							<span className='text-sm text-gray-400'>
								{formValue.shortDescription.length}/{MAX_SHORT_DESCRIPTION}
							</span>
						}
					/>
					<Textarea
						size='lg'
						disableAutosize
						label={<Label>Detail description</Label>}
						labelPlacement='outside'
						radius='sm'
						placeholder='Viết vào ở đây...'
						className='col-span-6'
						value={formValue.detailedDescription}
						onChange={handleInputChange}
						rows={8}
						name='detailedDescription'
					/>
					<div className='col-span-6 grid grid-cols-12 gap-4'>
						<Button
							type='button'
							onClick={handleCancel}
							className='col-start-6 col-span-1 bg-gray-300 text-gray-700 px-4 py-2 rounded'>
							Cancel
						</Button>
						<Button
							type='submit'
							className='col-span-1 bg-secondary px-4 py-2 rounded text-white'
							isLoading={courseMutation.isPending}>
							Create
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateCourse;

const Label = ({ children }) => {
	return <span className='text-sm text-gray-600 select-none'>{children}</span>;
};
