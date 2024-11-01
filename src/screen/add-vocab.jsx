import React, { Fragment, useContext, useState } from "react";
import { RiUserShared2Fill } from "react-icons/ri";
import { IoIosArrowDown, IoIosCloseCircle } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { TbTextPlus } from "react-icons/tb";
import { CgAttachment } from "react-icons/cg";
import { LuPlus } from "react-icons/lu";
import { ImBin } from "react-icons/im";
import { IoVolumeHigh } from "react-icons/io5";
import { AiOutlinePicture } from "react-icons/ai";
import { FcEditImage } from "react-icons/fc";
import { VocabularyService } from "../apis/vocabulary.api.js";
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx";
import { userState } from "../recoil/atoms/user.atom.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import {
	Accordion,
	AccordionItem,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
} from "@nextui-org/react";
import { SelectItem } from "@nextui-org/select";
import { CourseService } from "../apis/course.api.js";
import { Image } from "@nextui-org/image";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


function AddLevels() {
	const params = useParams();

	const { updateUserState } = useContext(GlobalStateContext);
	const user = useRecoilValue(userState);

	const queryClient = useQueryClient();


	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [vocabulary, setVocabulary] = useState("");
	const [definition, setDefinition] = useState("");
	const [typeWord, setTypeWord] = useState("");
	const [vocabList, setVocabList] = useState([]);
	const [audio, setAudio] = useState(null);
	const [currentAudio, setCurrentAudio] = useState(null);
	const [image, setImage] = useState(null);
	const [groupName, setGroupName] = useState("");
	const [groups, setGroups] = useState([]);
	const [selectedGroup, setSelectedGroup] = useState("");
	const [showGroupInput, setShowGroupInput] = useState(false);
	const [showTextModal, setShowTextModal] = useState(false);
	const [showFileModal, setShowFileModal] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showRenameLevelModal, setShowRenameModal] = useState(false);
	const [deleteContext, setDeleteContext] = useState(null);
	const [renameLevel, setRenameLevel] = useState({});


	const vocabularyQuery = useQuery({
		queryKey: ["vocabulary-course-manage", params?.courseId],
		queryFn: async ({ queryKey }) => {
			let vocabularyList = [];
			try {
				const data = await VocabularyService.fetchVocabulary(queryKey[1], user, updateUserState);
				if (data?.vocabularyList?.length === 0)
					return vocabularyList;
				let records = data?.vocabularyList;
				let count = 0, currentLevelId = records[0]?.["level id"];
				vocabularyList.push({
					levelId: records[0]?.["level id"],
					levelName: records[0]?.["level name"],
					words: [],
				});
				for (let record of records) {
					if (currentLevelId !== record?.["level id"]) {
						currentLevelId = record?.["level id"];
						vocabularyList.push({
							levelId: record?.["level id"],
							levelName: record?.["level name"],
							words: [],
						});
						count++;
					}
					if (record?.["word id"]) {
						vocabularyList[count].words.push({
							wordId: record?.["word id"],
							word: record?.["word"],
							definition: record?.["definition"],
							image: record?.["image"],
							pronunciation: record?.["pronunciation"],
							type: record?.["type"],
						});
					}
				}
			} catch (error) {
				console.error(error);
			}
			return vocabularyList;
		},
	});
	const courseLanguagesQuery = useQuery({
		queryKey: ["course-languages", params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseLanguages(queryKey[1]);
			} catch (error) {
				console.error(error);
				return {};
			}
		},
	});

	const addLevelMutation = useMutation({
		mutationFn: async () => {
			return await CourseService.addNewLevelCourse(params?.courseId, groupName, user, updateUserState);
		},
		onSuccess: ({ newLevel }) => {
			const newVocabularyList = vocabularyQuery.data.concat({
				levelId: newLevel["level id"],
				levelName: newLevel["level name"],
				words: [],
			});
			queryClient.setQueryData(["vocabulary-course-manage", params?.courseId], newVocabularyList);
			setGroupName("");
			setShowGroupInput(false); // Hide the input after saving
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const removeLevelMutation = useMutation({
		mutationFn: async (levelId) => {
			await CourseService.removeLevelCourse(params?.courseId, levelId, user, updateUserState);
			return levelId;
		},
		onSuccess: (levelId) => {
			const newLevels = vocabularyQuery.data.filter(item => item.levelId !== levelId);
			queryClient.setQueryData(["vocabulary-course-manage", params?.courseId], newLevels);
		}, onError: (error) => {
			console.error(error);
		},
	});

	const updateLevelNameMutation = useMutation({
		mutationFn: async () => {
			return await CourseService.updateLevelNameCourse(params?.courseId, renameLevel?.levelId, renameLevel?.levelName, user, updateUserState);
		},
		onSuccess: ({ updatedLevel }) => {
			const newVocabularyList = vocabularyQuery.data;
			for (let i = 0; i < newVocabularyList.length; i++) {
				if (newVocabularyList[i].levelId === updatedLevel["level id"]) {
					newVocabularyList[i].levelName = updatedLevel["level name"];
					break;
				}
			}
			queryClient.setQueryData(["vocabulary-course-manage", params?.courseId], newVocabularyList);
		},
		onError: (error) => {
			console.error(error);
		},

	});

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleClickOutside = (event) => {
		if (event.target.classList.contains("modal-overlay")) {
			setShowPermissionModal(false);
		}
	};

	const handleRenameLevel = (levelId, levelName) => {
		setShowRenameModal(true);
		setRenameLevel({ levelId, levelName });
	};


	const handleAdd = (e) => {
		e.preventDefault();
		if (vocabulary && definition) {
			const newVocab = {
				id: Date.now(), // Unique ID for each vocab item
				vocabulary,
				definition,
				audio,
				image,
				group: selectedGroup,
			};
			console.log(newVocab);
			setVocabulary("");
			setDefinition("");
			setAudio(null);
			setImage(null);
		}
	};
	const handleAudioChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setAudio(file);
		}
	};

	const toggleAudio = (audioFile) => {
		// Stop and reset the current audio if it exists
		if (currentAudio) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
			setCurrentAudio(null);
		}

		// Create a new Audio instance and play it if different
		const newAudio = new Audio(URL.createObjectURL(audioFile));
		newAudio.play();
		setCurrentAudio(newAudio);

		// Stop playback when the audio ends
		newAudio.onended = () => {
			setCurrentAudio(null);
		};
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setImage(URL.createObjectURL(file)); // Preview the selected image
		}
	};


	// Delete vocabulary
	const showDeleteConfirmation = (context) => {
		setDeleteContext(context);
		setShowDeleteModal(true);
	};
	const handleConfirmDelete = (id) => {
		if (deleteContext?.type === "vocab") {
			// Filter out the vocabulary item with matching ID
			setVocabList(vocabList.filter((item) => item.id !== deleteContext.id));
		} else if (deleteContext?.type === "group") {
			// Delete group and associated vocabulary items
			removeLevelMutation.mutate(deleteContext?.groupName);
		}
		setShowDeleteModal(false);
		setDeleteContext(null);
	};

	const handleUpdateLevelName = async () => {
		if (renameLevel.levelName) {
			updateLevelNameMutation.mutate();
			setShowRenameModal(false);
			return;
		}
		toast.warn("Tên không được để trống");
	};

	// Add group
	const saveGroup = async () => {
		if (groupName) {
			addLevelMutation.mutate();

		}
	};

	const deleteGroup = (levelId) => {
		removeLevelMutation.mutate(levelId);
		// setGroups(groups.filter(group => group.name !== groupName));
		// setVocabList(vocabList.filter(item => item.group !== groupName));
	};
	const toggleGroupVisibility = (groupName) => {
		setGroups(groups.map(group =>
			group.name === groupName ? { ...group, visible: !group.visible } : group,
		));
	};


	return (
		<div className="p-6 bg-gray-100 min-h-screen">


			{/* Content Section */}
			<div className="bg-white p-6 rounded-lg shadow-md relative mt-6 mb-6">
				<h2 className="text-xl font-bold mb-4">Tạo bộ từ vựng cho riêng bạn</h2>
				<p className="text-gray-400">Bộ từ vựng gia đình</p>

				{/* User icon for permission modal */}
				<button
					onClick={() => setShowPermissionModal(true)}
				><RiUserShared2Fill className="absolute top-4 right-6 size-5" />
				</button>
			</div>

			{/* Permission Modal */}
			{showPermissionModal && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal-overlay z-50"
					onClick={handleClickOutside}>
					<div className="relative bg-white p-6 rounded-lg shadow-lg w-1/3 z-60">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg font-bold">QUYỀN TRUY CẬP VÀ CHỈNH SỬA </h2>
							<button onClick={() => setShowPermissionModal(false)}>
								<IoIosCloseCircle className=" right-4 size-6" />
							</button>
						</div>

						<div className="grid grid-cols-2 gap-6">
							<div className="relative">
								<label className="block text-sm font-medium mb-2">Quyền truy cập</label>
								<select
									className="w-full px-3 py-2 mb-20 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
									<option>Chỉ mình tôi</option>
									<option>Mọi người</option>
								</select>
								<IoIosArrowDown
									className="absolute top-12 right-5 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
							</div>

							<div className="relative">
								<label className="block text-sm font-medium mb-2">Quyền chỉnh sửa</label>
								<select
									className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
									<option>Chỉ mình tôi</option>
									<option>Mọi người</option>
								</select>
								<IoIosArrowDown
									className="absolute top-12 right-4  transform -translate-y-1/2 text-gray-400 pointer-events-none" />
							</div>
						</div>
						<button
							onClick={() => setShowPermissionModal(false)}
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 mb-6 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
						>
							Lưu
						</button>

					</div>
				</div>
			)}

			<div className="flex mb-4">
				<button onClick={() => setShowTextModal(true)}
						className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2"><TbTextPlus
					className="size-6 mr-1" />
					<span> Thêm từ văn bản</span></button>
				<button onClick={() => setShowFileModal(true)}
						className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2"><CgAttachment
					className="size-6 mr-1" />
					<span> Thêm từ tệp</span></button>
				<button onClick={() => setShowGroupInput(!showGroupInput)}
						className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2"><LuPlus
					className="size-6 mr-1" />
					<span> Thêm nhóm/cấp độ</span></button>
			</div>


			<div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-start gap-6">
				{/* Left Section - Inputs */}
				<form className="w-1/3 bg-gray-50 rounded-lg shadow p-6 border-r" onSubmit={handleAdd}>

					{/* Vocabulary and Definition Inputs */}
					<div className="flex-col space-y-4">
						{/* Vocabulary Language Dropdown */}
						<div className="flex items-center">
							<div className="flex items-center gap-2">
								<Image radius="full" height={20} width={20}
									   src={courseLanguagesQuery.data?.["target language image"]}
									   alt={courseLanguagesQuery.data?.["target language name"]} />
								<span
									className="uppercase">{courseLanguagesQuery.data?.["target language abbreviation"]}</span>
							</div>
							<div className="ml-5">
								<Input
									required
									isRequired
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={vocabulary}
									onValueChange={setVocabulary}
									placeholder="Nhập từ vựng"
									label={<label>Từ
										vựng ({courseLanguagesQuery.data?.["target language name"]})</label>}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
							</div>
						</div>

						{/* Definition Language Dropdown */}
						<div className="flex items-center">
							<div className="flex items-center gap-2">
								<Image radius="full" height={20} width={20}
									   src={courseLanguagesQuery.data?.["source language image"]}
									   alt={courseLanguagesQuery.data?.["source language name"]} />
								<span
									className="uppercase">{courseLanguagesQuery.data?.["source language abbreviation"]}</span>
							</div>
							<div className="ml-5">
								<Input
									required
									isRequired
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={definition}
									onValueChange={setDefinition}
									placeholder="Nhập định nghĩa"
									label={<label className="-translate-y-2">Định nghĩa
										({courseLanguagesQuery.data?.["source language name"]})</label>}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
							</div>
						</div>

						<div className="flex items-center">
							<div className="ml-16">
								<Input
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={typeWord}
									onValueChange={setTypeWord}
									placeholder="Loại từ"
									label={<label className="-translate-y-2">Loại từ </label>}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
							</div>
						</div>

					</div>

					{/* Add audio */}
					<div className="flex gap-10 mt-6 ">
						<div className="mt-4">
							<button
								type="button"
								onClick={() => document.getElementById("audioInput").click()}
								className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100  transition"
							>
								<FaMicrophone />
								<span>Thêm âm thanh</span>
							</button>

							<input
								type="file"
								accept=".mp3, .mp4"
								onChange={handleAudioChange}
								id="audioInput"
								className="hidden"
							/>


							{audio && (
								<Fragment>
									<p className="mt-2 text-sm text-gray-600">
										{audio.name}
									</p>
									<span
										className="text-sm text-secondary cursor-pointer active:opacity-70 transition-all"
										onClick={() => setAudio(null)}>Remove</span>
								</Fragment>
							)}
						</div>

						{/*add image */}
						<div className="mt-4">
							<button
								type="button"
								onClick={() => document.getElementById("imageInput").click()}
								className="relative flex items-center gap-2 p-7 text-4xl cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-100  transition"
								style={{ width: "100px", height: "100px" }}
							>
								{image ? (
									<img
										src={image}
										alt="Preview"
										className="absolute inset-0 h-full w-full object-cover rounded-md"
										style={{ objectFit: "contain" }}
									/>
								) : (
									<AiOutlinePicture />
								)}
							</button>
							<input
								type="file"
								accept=".jpg, .png"
								onChange={handleImageChange}
								id="imageInput"
								className="hidden"
							/>
						</div>
					</div>

					{/* Group/Level Dropdown */}
					<div className="relative mt-4">
						<label className="block text-sm font-medium">Nhóm/Cấp độ</label>
						<Select
							isRequired
							aria-label="level course"
							variant="bordered"
							value={selectedGroup}
							onChange={(e) => setSelectedGroup(e.target.value)}
							radius="sm"
							className="bg-white rounded-small"
						>
							{vocabularyQuery?.data?.map(item => <SelectItem
								key={item?.levelId}>{item?.levelName}</SelectItem>)}
						</Select>
					</div>

					{/* Add Button */}
					<Button
						type="submit"
						radius="sm"
						className="mt-4 bg-secondary text-secondary-foreground">
						Thêm
					</Button>
				</form>


				<div className="w-2/3 border rounded-lg overflow-hidden">
					<div className="grid grid-cols-7 bg-blue-100 p-2 gap-x-1">
						<span className="font-bold text-blue-400 col-span-2 ">Từ vựng</span>
						<span className="font-bold text-blue-400 col-span-2 ml-4">Định nghĩa</span>
						<span className="font-bold text-blue-400 justify-self-end">Audio</span>
						<span className="font-bold text-blue-400 justify-self-end">Hình ảnh</span>
						<span className="font-bold text-blue-400 justify-self-end">Action</span>
					</div>
					<Accordion className="bg-blue-100">
						{vocabularyQuery.data?.map(item => {
							return <AccordionItem key={item.levelId} title={item.levelName}
												  disableIndicatorAnimation={true}
												  indicator={({ isOpen }) => (isOpen ?
													  <div className="flex items-center text-blue-400 font-bold gap-4">
														  <span>Ẩn</span>
														  <span className="hover:underline"
																onClick={() => handleRenameLevel(item.levelId, item.levelName)}
														  >Sửa tên</span>
														  <span className="hover:underline"
																onClick={() => showDeleteConfirmation({
																	type: "group",
																	groupName: item.levelId,
																})}>Xoá
														  </span>
													  </div> :
													  <div className="flex items-center text-blue-400 font-bold gap-4">
														  <span>Hiện</span>
														  <span className="hover:underline"
																onClick={() => handleRenameLevel(item.levelId, item.levelName)}>Sửa tên</span>
														  <span className="hover:underline"
																onClick={() => showDeleteConfirmation({
																	type: "group",
																	groupName: item.levelId,
																})}>Xoá
														  </span>
													  </div>)}>
								<ul>
									{item.words?.map((word, index) => {
										return <li key={word.wordId}
												   className="grid grid-cols-7 bg-gray-100 p-3 rounded-sm items-center gap-x-2 my-2">
											<p className="font-bold col-span-2">{index + 1}. {word.word} ({word.type})</p>
											<p className="col-span-2 ml-4">{word.definition}</p>
											<div className="col-span-1 flex justify-center items-center">
												{word.pronunciation && <IoVolumeHigh size={24}
																					 className="text-blue-500 hover:text-blue-700 transition" />}
											</div>
											<div className="col-span-1 flex justify-center items-center">
												{word.image && <FcEditImage size={24} />}
											</div>
											<div className="col-span-1 flex justify-center items-center">
												<button
													onClick={() => showDeleteConfirmation({
														type: "vocab",
														id: word.id,
													})}
													className="text-red-500 hover:text-red-700 transition">
													<ImBin />
												</button>
											</div>
										</li>;
									})}
								</ul>
							</AccordionItem>;
						})}
					</Accordion>

					{/* Display Grouped Vocabulary */}
					{groups.map((group, index) => (
						<div key={index} className="bg-blue-100 p-2 mt-2 rounded-md">
							<div className="flex justify-between items-center">
								<span className="font-bold text-blue-400">{group.name}</span>
								<div className="flex gap-2">
									<button onClick={() => toggleGroupVisibility(group.name)}>
										{group.visible ? "Ẩn" : "Hiện"}
									</button>
									<button onClick={() => showDeleteConfirmation({
										type: "group",
										groupName: group.name,
									})}>
										<ImBin />
									</button>
								</div>
							</div>

							{group.visible && (
								<ul className="space-y-2 mt-2">
									{vocabList.filter(item => item.group === group.name).map((item) => (
										<li key={item.id}
											className="grid grid-cols-7 bg-gray-100 p-3 rounded-md items-center gap-x-2">
											<p className="font-bold col-span-2">{item.vocabulary}</p>
											<p className="col-span-2 ml-4">{item.definition}</p>
											<div className="col-span-1 flex justify-center items-center">
												{item.audio && <IoVolumeHigh size={24}
																			 className="text-blue-500 hover:text-blue-700 transition" />}
											</div>
											<div className="col-span-1 flex justify-center items-center">
												{item.image && <FcEditImage size={24} />}
											</div>
											<div className="col-span-1 flex justify-center items-center">
												<button
													onClick={() => showDeleteConfirmation({
														type: "vocab",
														id: item.id,
													})}
													className="text-red-500 hover:text-red-700 transition"
												>
													<ImBin />
												</button>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
					))}
					{showGroupInput && (
						<div className="flex items-center mt-4 bg-gray-100 p-3 rounded-md gap-2">
							<Input
								variant="bordered"
								type="text"
								value={groupName}
								onValueChange={setGroupName}
								placeholder="Nhập tên nhóm"
								radius="sm"
								className="bg-white rounded-small"
								size="lg"
							/>
							<Button
								onClick={saveGroup}
								className="bg-third text-third-foreground"
								radius="sm"
								size="lg"
								isLoading={addLevelMutation.isPending}
							>
								Lưu
							</Button>
						</div>
					)}
				</div>

			</div>

			{showTextModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold">Thêm từ vựng từ văn bản</h2>
							<button onClick={() => setShowTextModal(false)}>
								<IoIosCloseCircle className="size-6" />
							</button>
						</div>
						<p className="text-gray-500 mb-4">Những từ quan trọng sẽ được thêm vào bộ từ vựng</p>
						<textarea
							className="w-full p-4 h-40 border border-gray-300 rounded-md mb-4"
							placeholder="Nhập hoặc dán ở đây..."
						></textarea>
						<div className="flex justify-end">
							<button
								onClick={() => setShowTextModal(false)}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
							>
								Hủy
							</button>
							<button className="px-4 py-2 bg-gray-500 text-white rounded-md">Thêm</button>
						</div>
					</div>
				</div>
			)}

			{/* File Modal */}
			{showFileModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-semibold">Thêm từ vựng từ tệp</h2>
							<button onClick={() => setShowFileModal(false)}>
								<IoIosCloseCircle className="size-6" />
							</button>
						</div>
						<p className="text-gray-500 mb-4">Những từ quan trọng sẽ được thêm vào bộ từ vựng</p>

						{/* Hidden file input */}
						<input
							type="file"
							id="fileInput"
							accept=".txt, .docx, .pdf, .jpg, .png"
							onChange={handleFileChange}
							className="hidden"
						/>
						<div className="border border-gray-300 bg-gray-200 rounded-md p-12 mb-4 text-center">
							<button
								className="bg-white text-gray-700 py-2 px-6 rounded-md mb-4"
								onClick={() => document.getElementById("fileInput").click()}
							>
								Chọn
							</button>
							{selectedFile && <p className="mt-4">Đã chọn: {selectedFile.name}</p>}
							<p>hoặc kéo thả ở đây...</p>
							<div className="mt-4 flex justify-center gap-6 text-gray-400">
								<span>(JPG, PNG)</span>
								<span>(TXT, DOCX, PDF)</span>
							</div>
						</div>

						<div className="flex justify-end">
							<button onClick={() => setShowFileModal(false)}
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">
								Hủy
							</button>
							<button className="px-4 py-2 bg-gray-500 text-white rounded-md">Thêm</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			<Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Xác nhận xóa</ModalHeader>
							<ModalBody>
								<p className="text-gray-500 mb-4">
									Bạn có chắc chắn muốn
									xóa {deleteContext?.type === "group" ? "nhóm này" : "từ vựng này"} không?
								</p>

							</ModalBody>
							<ModalFooter>
								<Button color="default" variant="light" onPress={onClose} radius="sm"
										className="bg-gray-200">
									Hủy
								</Button>
								<Button color="danger" variant="solid" onPress={handleConfirmDelete} radius="sm"
										isLoading={removeLevelMutation.isPending}>
									Xóa
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>

			<Modal isOpen={showRenameLevelModal} onClose={() => setShowRenameModal(false)}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">Đổi tên nhóm từ vựng</ModalHeader>
							<ModalBody>
								<Input type="text" value={renameLevel.levelName}
									   onChange={e => setRenameLevel(prev => ({
										   ...prev,
										   levelName: e.target.value,
									   }))} />
							</ModalBody>
							<ModalFooter>
								<Button color="default" variant="light" onPress={onClose} radius="sm"
										className="bg-gray-200">
									Hủy
								</Button>
								<Button color="danger" variant="solid" onPress={handleUpdateLevelName} radius="sm"
										isLoading={updateLevelNameMutation.isPending}>
									Lưu
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

export default AddLevels;
