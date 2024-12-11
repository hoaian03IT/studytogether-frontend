import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CourseService } from "../apis/course.api.js";
import { Button, Input, Select } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { SelectItem } from "@nextui-org/select";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageService } from "../apis/language.api.js";
import { CourseLevelService } from "../apis/courseLevel.api.js";
import defaultUploadImage from "../assets/default-placeholder-upload.png";
import { queryKeys } from "../react-query/query-keys.js";
import { base64Converter } from "../utils/base64-convert.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { TbEdit } from "react-icons/tb";
import { TranslationContext } from "../providers/TranslationProvider.jsx";

const MAX_CHAR_COURSE_NAME = 100;
const MAX_CHAR_TAG = 30;
const MAX_SHORT_DESCRIPTION = 255;

const EditCourseInfor = () => {
	const params = useParams();
	const courseInfoQuery = useQuery({
		queryKey: [queryKeys.courseInfo, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseInformation(queryKey[1]);
			} catch (error) {
				console.error(error);
			}
		},
	});
	let user = useRecoilValue(userState);
	let { updateUserState } = useContext(GlobalStateContext);
	let { translation } = useContext(TranslationContext);

	const [formValue, setFormValue] = useState({
		targetLanguageId: "",
		sourceLanguageId: "",
		courseLevelId: "",
		courseName: "",
		tag: "",
		shortDescription: "",
		detailedDescription: "",
		image: "",
		isPrivate: null,
	});

	const [editable, setEditable] = useState(false);

	const navigate = useNavigate();
	const inputFileRef = useRef();

	useEffect(() => {
		handleFormValueInitial(courseInfoQuery.data);
	}, [courseInfoQuery.data]);

	const handleFormValueInitial = (courseInfo) => {
		setFormValue({
			targetLanguageId: courseInfo?.["target language id"]?.toString(), // Select Component của NextUI chỉ chấp nhận string
			sourceLanguageId: courseInfo?.["source language id"]?.toString(), // Select Component của NextUI chỉ chấp nhận string
			courseLevelId: courseInfo?.["course level id"]?.toString(), // Select Component của NextUI chỉ chấp nhận string
			courseName: courseInfo?.["name"],
			tag: courseInfo?.["tag"],
			shortDescription: courseInfo?.["short description"],
			detailedDescription: courseInfo?.["detailed description"],
			image: courseInfo?.["image"],
			isPrivate: courseInfo?.["is private"]?.toString(), // Select Component của NextUI chỉ chấp nhận string
		});
	};

	const updateCourseMutation = useMutation({
		mutationFn: async (payload) => {
			return await CourseService.updateCourseInformation(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			toast.success("Cập nhật khóa học thành công!");
		},
		onError: (error) => {
			toast.error(translation(error.response.data?.errorCode));
			console.error(error);
		},
	});

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
			[name]: value?.toString(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!editable) return;
		if (formValue.targetLanguageId === formValue.sourceLanguageId) {
			toast.warn("Ngôn ngữ học và ngôn ngữ gốc không được giống nhau!");
			return;
		}

		updateCourseMutation.mutate({
			courseId: params?.courseId,
			courseName: formValue.courseName,
			sourceLanguageId: formValue.sourceLanguageId,
			courseLevelId: formValue.courseLevelId,
			tag: formValue.tag,
			shortDescription: formValue.shortDescription,
			detailedDescription: formValue.detailedDescription,
			image: formValue.image === courseInfoQuery.data?.["image"] ? null : formValue.image,
			isPrivate: formValue.isPrivate,
		});
		setEditable(false);
	};

	const handleCancel = () => {
		handleFormValueInitial(courseInfoQuery.data);
		setEditable(false);
	};

	return (
		<div className="bg-white px-6 rounded w-full flex flex-col items-center">
			<div className="max-w-screen-lg w-full">
				<div>
					<button
						className="flex items-center text-secondary text-xl hover:underline transition-all"
						onClick={() => setEditable(!editable)}>
						Chỉnh sửa ngay
						<TbEdit className="size-6" />
					</button>
				</div>
				<form
					onSubmit={handleSubmit}
					onReset={handleCancel}
					className="my-6 w-full grid gap-x-4 gap-y-5 grid-cols-6">
					<div className="col-span-4 grid grid-cols-2 gap-y-5">
						<div className="col-span-2 grid grid-cols-3 gap-4">
							<Select
								isDisabled={!editable}
								selectedKeys={[formValue.isPrivate]}
								size="lg"
								label={<Label>Quyền truy cập</Label>}
								labelPlacement="outside"
								radius="sm"
								isRequired
								name="isPrivate"
								value={formValue.isPrivate}
								onChange={handleInputChange}>
								<SelectItem value="0" key="0">
									Public
								</SelectItem>
								<SelectItem value="1" key="1">
									Private
								</SelectItem>
							</Select>
							<Select
								isDisabled={!editable}
								selectedKeys={[formValue.sourceLanguageId]}
								size="lg"
								label={<Label>Ngôn ngữ gốc</Label>}
								placeholder="English"
								labelPlacement="outside"
								radius="sm"
								isRequired
								name="sourceLanguageId"
								value={formValue.sourceLanguageId}
								onChange={handleInputChange}>
								{languageQuery.data?.languages?.map((language) => (
									<SelectItem
										startContent={
											<img className="size-5 rounded-full" src={language["image"]} alt="" />
										}
										className="py-3"
										key={language["language id"]}
										value={language["language id"]}>
										{language["language name"]}
									</SelectItem>
								))}
							</Select>
							<Select
								isDisabled={!editable}
								selectedKeys={[formValue.targetLanguageId]}
								size="lg"
								label={<Label>Ngôn ngữ học</Label>}
								placeholder="Tiếng Việt"
								labelPlacement="outside"
								radius="sm"
								isRequired
								name="targetLanguageId"
								value={formValue.targetLanguageId}
								onChange={handleInputChange}>
								{languageQuery.data?.languages?.map((language) => (
									<SelectItem
										startContent={
											<img className="size-5 rounded-full" src={language["image"]} alt="" />
										}
										className="py-3"
										key={language["language id"]}
										value={language["language id"]}>
										{language["language name"]}
									</SelectItem>
								))}
							</Select>
						</div>
						<Select
							isDisabled={!editable}
							selectedKeys={[formValue.courseLevelId]}
							size="lg"
							label={<Label>Cấp độ</Label>}
							className="col-span-4"
							placeholder="Cấp độ"
							labelPlacement="outside"
							radius="sm"
							isRequired
							value={formValue.courseLevelId}
							onChange={handleInputChange}
							name="courseLevelId">
							{levelCourseQuery.data?.levelCourses?.map((levelCourse) => (
								<SelectItem
									className="py-3"
									key={levelCourse["course level id"]}
									value={levelCourse["course level id"]}>
									{levelCourse["course level name"]}
								</SelectItem>
							))}
						</Select>
						<Input
							isDisabled={!editable}
							size="lg"
							name="courseName"
							type="text"
							label={<Label>Tên bộ từ vựng</Label>}
							labelPlacement="outside"
							radius="sm"
							placeholder="VD: Tiếng anh lớp 6"
							value={formValue.courseName}
							onChange={(e) => {
								if (e.target.value?.length <= MAX_CHAR_COURSE_NAME) {
									setFormValue((prev) => ({ ...prev, courseName: e.target.value }));
								}
							}}
							className="col-span-4"
							required
							isRequired
							endContent={
								<span className="text-sm text-gray-400">
									{formValue.courseName?.length}/{MAX_CHAR_COURSE_NAME}
								</span>
							}
						/>
						<Input
							isDisabled={!editable}
							size="lg"
							name="tag"
							type="text"
							label={<Label>Từ khoá</Label>}
							placeholder="VD: lớp 6"
							labelPlacement="outside"
							radius="sm"
							className="col-span-4"
							value={formValue.tag}
							onChange={(e) => {
								if (e.target.value?.length <= MAX_CHAR_TAG) {
									setFormValue((prev) => ({ ...prev, tag: e.target.value }));
								}
							}}
							required
							isRequired
							endContent={
								<span className="text-sm text-gray-400">
									{formValue.tag?.length}/{MAX_CHAR_TAG}
								</span>
							}
						/>
					</div>
					<div className="col-span-2 row-span-2 flex flex-col w-full h-full">
						<div className="-translate-y-1">
							<Label>Hình ảnh</Label>
						</div>
						<div className="flex flex-col justify-center h-full">
							<img
								onClick={handleOpenFileSelect}
								loading="eager"
								className="flex-1 rounded-md object-cover object-center mb-2 cursor-pointer hover:bg-gray-100 transition-all"
								src={formValue.image || defaultUploadImage}
								alt=""
							/>
							<Input
								isDisabled={!editable}
								ref={inputFileRef}
								type="file"
								radius="sm"
								onChange={onChangeImage}
								multiple={false}
								accept="image/*"
								className="hidden"
							/>
							<div className="flex items-center justify-center gap-4">
								<button
									disabled={!editable}
									type="button"
									className="text-sm underline select-none active:opacity-80"
									onClick={() => setFormValue((prev) => ({ ...prev, image: null }))}>
									Remove
								</button>
								<button
									disabled={!editable}
									type="button"
									className="text-sm underline select-none active:opacity-80"
									onClick={() =>
										setFormValue((prev) => ({
											...prev,
											image: courseInfoQuery.data?.["image"],
										}))
									}>
									Reset
								</button>
							</div>
						</div>
					</div>

					<Textarea
						isDisabled={!editable}
						size="lg"
						name="shortDescription"
						type="text"
						label={<Label>Mô tả ngắn</Label>}
						labelPlacement="outside"
						radius="sm"
						placeholder="Viết vào ở đây..."
						className="col-span-4"
						value={formValue.shortDescription}
						onChange={(e) => {
							if (e.target.value?.length <= MAX_SHORT_DESCRIPTION) {
								setFormValue((prev) => ({ ...prev, shortDescription: e.target.value }));
							}
						}}
						rows={3}
						disableAutosize
						endContent={
							<span className="text-sm text-gray-400">
								{formValue.shortDescription?.length}/{MAX_SHORT_DESCRIPTION}
							</span>
						}
					/>
					<Textarea
						isDisabled={!editable}
						size="lg"
						disableAutosize
						label={<Label>Mô tả chi tiết</Label>}
						labelPlacement="outside"
						radius="sm"
						placeholder="Viết vào ở đây..."
						className="col-span-6"
						value={formValue.detailedDescription}
						onChange={handleInputChange}
						rows={8}
						name="detailedDescription"
					/>
					{editable && (
						<div className="col-span-6 grid grid-cols-12 gap-4">
							<Button
								type="reset"
								className="col-start-6 col-span-1 bg-gray-300 text-gray-700 px-4 py-2 rounded">
								Hủy
							</Button>
							<Button
								type="submit"
								className="col-span-1 bg-secondary px-4 py-2 rounded text-white"
								isLoading={updateCourseMutation.isPending}>
								Lưu
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default EditCourseInfor;

const Label = ({ children }) => {
	return <span className="text-sm text-gray-600 select-none">{children}</span>;
};
