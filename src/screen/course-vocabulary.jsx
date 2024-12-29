import React, { Fragment, useContext, useRef, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";
import { VocabularyService } from "../apis/vocabulary.api.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { userState } from "../recoil/atoms/user.atom.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import {
	Accordion,
	AccordionItem,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
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
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { base64Converter } from "../utils/base64-convert.js";
import { queryKeys } from "../react-query/query-keys.js";
import { WordListEdit } from "../components/word-list-edit.jsx";
import { useDebounce } from "../hooks/useDebounce.jsx";
import { useGenerateWordInformation } from "../hooks/useAIGeneration.jsx";
import { pathname } from "../routes/index.js";

function CourseVocabulary() {
	const params = useParams();

	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const user = useRecoilValue(userState);

	const queryClient = useQueryClient();

	const [vocabulary, setVocabulary] = useState("");
	const [definition, setDefinition] = useState("");
	const [typeWord, setTypeWord] = useState("");
	const [audio, setAudio] = useState(null);
	const [image, setImage] = useState(null);
	const [transcription, setTranscription] = useState("");
	const [groupName, setGroupName] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");
	const [showGroupInput, setShowGroupInput] = useState(false);
	const [showTextModal, setShowTextModal] = useState(false);
	const [showFileModal, setShowFileModal] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showRenameLevelModal, setShowRenameModal] = useState(false);
	const [deleteContext, setDeleteContext] = useState(null);
	const [renameLevel, setRenameLevel] = useState({});
	const [wordEditing, setWordEditing] = useState({
		isEditing: false,
		oldLevelId: null,
		wordId: null,
	});

	const triggerDefinitionSuggestion = useRef(null);
	const triggerTypeWordSuggestion = useRef(null);
	const triggerTranscriptSuggestion = useRef(null);

	const wordDebounced = useDebounce(vocabulary, 800);

	const vocabularyQuery = useQuery({
		queryKey: [queryKeys.courseVocabulary, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await VocabularyService.fetchVocabulary(queryKey[1], user, updateUserState);
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});
	const courseLanguagesQuery = useQuery({
		queryKey: [queryKeys.courseLanguages, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				return await CourseService.fetchCourseLanguages(queryKey[1]);
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const {
		translation: wordTranslation,
		type,
		transcript,
	} = useGenerateWordInformation({
		sourceLanguage: courseLanguagesQuery.data?.["source language name"],
		targetLanguage: courseLanguagesQuery.data?.["target language name"],
		word: wordDebounced,
	});

	const addLevelMutation = useMutation({
		mutationFn: async ({ courseId, groupName }) => {
			return await CourseService.addNewLevelCourse(courseId, groupName, user, updateUserState);
		},
		onSuccess: ({ newLevel }) => {
			const oldData = queryClient.getQueryData([queryKeys.courseVocabulary, params?.courseId]);

			const newVocabularyList = oldData.vocabularyList.concat({
				levelId: newLevel["level id"].toString(),
				levelName: newLevel["level name"],
				words: [],
			});

			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				vocabularyList: newVocabularyList,
				oldData,
			});
			setGroupName("");
			setShowGroupInput(false); // Hide the input after saving
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});
	const removeLevelMutation = useMutation({
		mutationFn: async (levelId) => {
			await CourseService.removeLevelCourse(params?.courseId, levelId, user, updateUserState);
			return levelId;
		},
		onSuccess: (levelId) => {
			const oldData = queryClient.getQueryData([queryKeys.courseVocabulary, params?.courseId]);

			const newLevels = oldData.vocabularyList.filter((item) => item.levelId !== levelId);
			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				...oldData,
				vocabularyList: newLevels,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.response?.data?.errorCode);
		},
	});
	const updateLevelNameMutation = useMutation({
		mutationFn: async () => {
			return await CourseService.updateLevelNameCourse(
				params?.courseId,
				renameLevel?.levelId,
				renameLevel?.levelName,
				user,
				updateUserState,
			);
		},
		onSuccess: ({ updatedLevel }) => {
			const oldData = queryClient.getQueryData([queryKeys.courseVocabulary, params?.courseId]);
			const newVocabularyList = oldData.vocabularyList;
			for (let i = 0; i < newVocabularyList.length; i++) {
				if (newVocabularyList[i].levelId === updatedLevel["level id"]) {
					newVocabularyList[i].levelName = updatedLevel["level name"];
					break;
				}
			}
			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				...oldData,
				vocabularyList: newVocabularyList,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.response?.data?.errorCode);
		},
	});
	const addWordMutation = useMutation({
		mutationFn: async (payload) => await VocabularyService.addNewVocabulary(payload, user, updateUserState),
		onSuccess: (data) => {
			const newWord = data?.newWord;
			let newVocabularyList = vocabularyQuery.data.vocabularyList;
			for (let i = 0; i < newVocabularyList?.length; i++) {
				if (newVocabularyList[i].levelId === newWord["level id"]) {
					newVocabularyList[i]["words"].push({
						wordId: newWord?.["word id"],
						word: newWord?.["word"],
						definition: newWord?.["definition"],
						image: newWord?.["image"],
						pronunciation: newWord?.["pronunciation"],
						type: newWord?.["type"],
						transcription: newWord?.["transcription"],
					});
					break;
				}
			}
			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				...vocabularyQuery.data,
				vocabularyList: newVocabularyList,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error?.response?.data?.errorCode));
		},
	});
	const removeWordMutation = useMutation({
		mutationFn: async (payload) => {
			const { wordId, levelId } = payload;
			await VocabularyService.removeVocabulary(
				{
					courseId: params?.courseId,
					wordId,
					levelId,
				},
				user,
				updateUserState,
			);
			return payload;
		},
		onSuccess: (data) => {
			const { wordId, levelId } = data;
			let newVocabularyList = vocabularyQuery.data.vocabularyList;
			for (let i = 0; i < newVocabularyList?.length; i++) {
				if (newVocabularyList[i].levelId === levelId) {
					let wordList = newVocabularyList[i].words;
					wordList = wordList.filter((word) => wordId !== word?.wordId);
					newVocabularyList[i].words = wordList;
					break;
				}
			}
			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				...vocabularyQuery.data,
				vocabularyList: newVocabularyList,
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});
	const updateWordMutation = useMutation({
		mutationFn: async (payload) => {
			return await VocabularyService.updateVocabulary(
				{
					courseId: payload?.courseId,
					levelId: payload?.levelId,
					wordId: payload?.wordId,
					word: payload?.word,
					definition: payload?.definition,
					image: payload?.image,
					pronunciation: payload?.pronunciation,
					type: payload?.type,
					transcription: payload?.transcription,
				},
				user,
				updateUserState,
			);
		},
		onSuccess: (data) => {
			const updatedWord = data?.updatedWord;
			let newVocabularyList = vocabularyQuery.data.vocabularyList;
			if (!newVocabularyList || !updatedWord) return;
			// Trường hợp cập nhật từ trong cùng level
			if (updatedWord["level id"].toString() === wordEditing.oldLevelId) {
				const levelIndex = newVocabularyList.findIndex((level) => level.levelId === updatedWord["level id"]);

				if (levelIndex !== -1) {
					const wordIndex = newVocabularyList[levelIndex].words.findIndex(
						(word) => word.wordId === updatedWord?.["word id"],
					);

					if (wordIndex !== -1) {
						// Cập nhật thông tin từ
						newVocabularyList[levelIndex].words[wordIndex] = {
							wordId: updatedWord?.["word id"],
							word: updatedWord?.["word"],
							definition: updatedWord?.["definition"],
							image: updatedWord?.["image"],
							pronunciation: updatedWord?.["pronunciation"],
							type: updatedWord?.["type"],
							transcription: updatedWord?.["transcription"],
						};
					}
				}
			}
			// Trường hợp chuyển từ sang level khác
			else {
				// Xóa từ khỏi level cũ
				const oldLevelIndex = newVocabularyList.findIndex(
					(level) => level.levelId.toString() === wordEditing.oldLevelId,
				);

				if (oldLevelIndex !== -1) {
					newVocabularyList[oldLevelIndex].words = newVocabularyList[oldLevelIndex].words.filter(
						(word) => word.wordId !== updatedWord?.["word id"],
					);
				}

				// Thêm từ vào level mới
				const newLevelIndex = newVocabularyList.findIndex(
					(level) => level.levelId === updatedWord?.["level id"],
				);

				if (newLevelIndex !== -1) {
					newVocabularyList[newLevelIndex].words.push({
						wordId: updatedWord?.["word id"],
						word: updatedWord?.["word"],
						definition: updatedWord?.["definition"],
						image: updatedWord?.["image"],
						pronunciation: updatedWord?.["pronunciation"],
						type: updatedWord?.["type"],
						transcription: updatedWord?.["transcription"],
					});
				}
			}

			// Cập nhật cache và clear form
			queryClient.setQueryData([queryKeys.courseVocabulary, params?.courseId], {
				...vocabularyQuery.data,
				vocabularyList: newVocabularyList,
			});
			clearFormWord();
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleRenameLevel = (levelId, levelName) => {
		setShowRenameModal(true);
		setRenameLevel({ levelId, levelName });
	};

	const handleAdd = (e) => {
		e.preventDefault();
		if (vocabulary && definition) {
			addWordMutation.mutate({
				courseId: params?.courseId,
				levelId: selectedGroup,
				word: vocabulary,
				definition: definition,
				image: image?.value,
				pronunciation: audio?.value,
				type: typeWord,
				transcription: transcription,
			});
			setVocabulary("");
			setDefinition("");
			setTypeWord("");
			setAudio(null);
			setImage(null);
		}
	};

	const handleAudioChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			base64Converter(file)
				.then((response) => {
					let { fileName, base64 } = response;
					setAudio({ value: base64, name: fileName });
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			base64Converter(file)
				.then((response) => {
					let { fileName, base64 } = response;
					setImage({ name: fileName, value: base64 });
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	// Delete vocabulary
	const showDeleteConfirmation = (context) => {
		setDeleteContext(context);
		setShowDeleteModal(true);
	};
	const handleConfirmDelete = () => {
		if (deleteContext?.type === "vocab") {
			// Filter out the vocabulary item with matching ID
			removeWordMutation.mutate({ wordId: deleteContext?.wordId, levelId: deleteContext?.levelId });
		} else if (deleteContext?.type === "group") {
			// Delete group and associated vocabulary items
			removeLevelMutation.mutate(deleteContext?.groupId);
		}
		setShowDeleteModal(false);
		setDeleteContext(null);
	};
	// --------------

	const handleUpdateLevelName = async (e) => {
		e.preventDefault();
		if (renameLevel.levelName) {
			updateLevelNameMutation.mutate();
			setShowRenameModal(false);
			return;
		}
		toast.warn("Tên không được để trống");
	};

	const handleEditWord = ({ levelId, wordId, word, definition, type, image, pronunciation, transcription }) => {
		setWordEditing({ oldLevelId: levelId.toString(), wordId, isEditing: true });
		setSelectedGroup(levelId.toString());
		setVocabulary(word);
		setDefinition(definition);
		setTypeWord(type);
		setImage(image ? { name: image, value: image } : null);
		setAudio(pronunciation ? { name: pronunciation, value: pronunciation } : null);
		setTranscription(transcription);
	};

	const handleUpdateWord = (e) => {
		e.preventDefault();
		updateWordMutation.mutate({
			courseId: params?.courseId,
			levelId: selectedGroup,
			wordId: wordEditing.wordId,
			word: vocabulary,
			definition: definition,
			image: image?.value,
			pronunciation: audio?.value,
			type: typeWord,
			transcription: transcription,
		});
	};

	// Add group
	const saveGroup = async (e) => {
		e.preventDefault();
		if (groupName) {
			addLevelMutation.mutate({ courseId: params?.courseId, groupName });
		}
	};

	const clearFormWord = () => {
		setWordEditing({ oldLevelId: null, wordId: null, isEditing: false });
		setImage(null);
		setAudio(null);
		setVocabulary("");
		setDefinition("");
		setTypeWord("");
		setTranscription("");
	};

	const handleChangeGroup = (e) => {
		setSelectedGroup(e.target.value);
	};

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{/* Content Section */}
			<div className="bg-white p-6 rounded-lg shadow-md relative mt-6 mb-6">
				<h2 className="text-xl font-bold mb-4">{translation("vocabulary-screen.title")}</h2>
				<p className="text-gray-400">{translation("vocabulary-screen.placeholder-title")}</p>
			</div>
			<div className="flex mb-4">
				<button
					onClick={() => setShowGroupInput(!showGroupInput)}
					className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm mr-2">
					<LuPlus className="size-6 mr-1" />
					<span>{translation("vocabulary-screen.title-add-level")}</span>
				</button>
			</div>
			<div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-start gap-6">
				{/* Left Section - Inputs */}
				<form
					className="w-1/4 bg-gray-50 rounded-lg shadow p-2 border-r space-y-4"
					onSubmit={wordEditing.isEditing ? handleUpdateWord : handleAdd}>
					{/* Vocabulary and Definition Inputs */}
					<div className="flex-col space-y-4">
						<div className="flex items-end">
							<div className="flex items-center gap-2 -translate-y-2">
								<Image
									radius="full"
									src={courseLanguagesQuery.data?.["target language image"]}
									alt={courseLanguagesQuery.data?.["target language name"]}
									className="size-5 flex-1"
								/>
								<span className="uppercase">
									{courseLanguagesQuery.data?.["target language abbreviation"]}
								</span>
							</div>
							<div className="ml-2 flex-1">
								<Input
									required
									isRequired
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={vocabulary}
									onValueChange={setVocabulary}
									placeholder={translation("vocabulary-screen.word-placeholder")}
									label={
										<label>
											{translation("vocabulary-screen.word")} (
											{courseLanguagesQuery.data?.["target language name"]})
										</label>
									}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
							</div>
						</div>

						<div className="flex items-end">
							<div className="flex items-center gap-2 -translate-y-2">
								<Image
									radius="full"
									src={courseLanguagesQuery.data?.["source language image"]}
									alt={courseLanguagesQuery.data?.["source language name"]}
									className="size-5 flex-1"
								/>
								<span className="uppercase">
									{courseLanguagesQuery.data?.["source language abbreviation"]}
								</span>
							</div>
							<div className="ml-2 flex-1">
								<Input
									required
									isRequired
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={definition}
									onValueChange={setDefinition}
									onPointerDown={() => {
										wordTranslation.length > 0 && triggerDefinitionSuggestion.current.click();
									}}
									placeholder={translation("vocabulary-screen.definition-placeholder")}
									label={
										<label className="-translate-y-2">
											{translation("vocabulary-screen.definition")} (
											{courseLanguagesQuery.data?.["source language name"]})
										</label>
									}
									labelPlacement="outside"
									className="bg-white rounded-small"
									autoFocus
								/>
								<Dropdown className="w-72" radius="sm">
									<DropdownTrigger>
										<div ref={triggerDefinitionSuggestion} className="w-full"></div>
									</DropdownTrigger>
									<DropdownMenu>
										{wordTranslation.map((item, index) => (
											<DropdownItem
												radius="sm"
												color="light"
												key={item}
												onClick={() => {
													setDefinition((prev) =>
														!prev.includes(item)
															? prev
																? `${prev}, ${item}`
																: item
															: prev,
													);
													// add appropriate type based on definition
													setTypeWord((prev) =>
														!prev.includes(type[index])
															? prev
																? `${prev}, ${type[index]}`
																: type[index]
															: prev,
													);
													//  add appropriate transcript based on type word
													setTranscription((prev) =>
														!prev.includes(transcript[index])
															? prev
																? `${prev}, \\${transcript[index]}\\`
																: `\\${transcript[index]}\\`
															: prev,
													);
												}}>
												{item}
											</DropdownItem>
										))}
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
						<div className="flex items-center">
							<div className="flex-1">
								<Input
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={typeWord}
									onValueChange={setTypeWord}
									onPointerDown={() => {
										type.length > 0 && triggerTypeWordSuggestion.current.click();
									}}
									placeholder={translation("vocabulary-screen.type-placeholder")}
									label={
										<label className="-translate-y-2">
											{translation("vocabulary-screen.type")}
										</label>
									}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
								<Dropdown className="w-80" radius="sm">
									<DropdownTrigger>
										<div ref={triggerTypeWordSuggestion} className="w-full"></div>
									</DropdownTrigger>
									<DropdownMenu>
										{type
											.filter((e, i, self) => i === self.indexOf(e))
											.map((item) => (
												<DropdownItem
													radius="sm"
													color="light"
													key={item}
													onClick={() => {
														setTypeWord((prev) =>
															!prev.includes(item)
																? prev
																	? `${prev}, ${item}`
																	: item
																: prev,
														);
														//  add appropriate transcript based on type word
														let indexOfAppropriateTranscript = type.findIndex(
															(i) => i === item,
														);
														setTranscription((prev) =>
															!prev.includes(transcript[indexOfAppropriateTranscript])
																? prev
																	? `${prev}, \\${transcript[indexOfAppropriateTranscript]}\\`
																	: `\\${transcript[indexOfAppropriateTranscript]}\\`
																: prev,
														);
													}}>
													{item}
												</DropdownItem>
											))}
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
						<div className="flex items-center">
							<div className="flex-1">
								<Input
									variant="bordered"
									size="md"
									type="text"
									radius="sm"
									value={transcription}
									onValueChange={setTranscription}
									onPointerDown={() => {
										transcript.length > 0 && triggerTranscriptSuggestion.current.click();
									}}
									placeholder={translation("vocabulary-screen.transcription-placeholder")}
									label={
										<label className="-translate-y-2">
											{translation("vocabulary-screen.transcription")}
										</label>
									}
									labelPlacement="outside"
									className="bg-white rounded-small"
								/>
								<Dropdown className="w-80" radius="sm">
									<DropdownTrigger>
										<div ref={triggerTranscriptSuggestion} className="w-full"></div>
									</DropdownTrigger>
									<DropdownMenu>
										{transcript
											.filter((e, i, self) => i === self.indexOf(e))
											.map((item) => (
												<DropdownItem
													radius="sm"
													color="light"
													key={item}
													onClick={() => {
														setTranscription((prev) =>
															!prev.includes(item)
																? prev
																	? `${prev}, ${item}`
																	: item
																: prev,
														);
													}}>
													{item}
												</DropdownItem>
											))}
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
					</div>

					{/* Add audio */}
					<div>
						<div className="space-y-2">
							<label className="text-sm">{translation("vocabulary-screen.audio")}</label>
							{!audio && (
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => document.getElementById("audioInput").click()}
										className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100  transition">
										<FaMicrophone />
										<span>{translation("vocabulary-screen.audio-placeholder")}</span>
									</button>
									{/* <button
										type="button"
										className="flex items-center gap-2 text-sm font-medium cursor-pointer bg-white border border-gray-300 p-2 rounded-md hover:bg-gray-100  transition">
										<FaMicrophone />
										<span>Ghi âm</span>
									</button> */}
								</div>
							)}
							<input
								type="file"
								accept=".mp3"
								onChange={handleAudioChange}
								id="audioInput"
								className="hidden"
								multiple={false}
							/>
							{audio && (
								<Fragment>
									<p className="mt-2 text-sm text-gray-600 max-w-60 break-all overflow-hidden">
										{audio?.name}
									</p>
									<span
										className="text-sm text-secondary cursor-pointer active:opacity-70 transition-all"
										onClick={() => setAudio(null)}>
										{translation("vocabulary-screen.remove")}
									</span>
								</Fragment>
							)}
						</div>

						{/*add image */}
						<div className="mt-4 space-y-2">
							<label className="text-sm">{translation("vocabulary-screen.image")}</label>
							<div>
								<button type="button" className="border-1 rounded-sm border-dashed border-gray-300">
									<Image
										onClick={() => document.getElementById("imageInput").click()}
										src={
											image?.value ||
											"https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg"
										}
										alt="Preview"
										className="inset-0 size-28 object-contain rounded-md"
									/>
								</button>
							</div>
							{image && (
								<span
									className="text-sm text-secondary cursor-pointer active:opacity-70 transition-all"
									onClick={() => setImage(null)}>
									{translation("vocabulary-screen.remove")}
								</span>
							)}
							<input
								type="file"
								accept=".jpg, .png"
								value={image?.fileName}
								onChange={handleImageChange}
								id="imageInput"
								className="hidden"
							/>
						</div>
					</div>

					{/* Group/Level Dropdown */}
					<div>
						<Select
							isRequired
							aria-label="level course"
							label={<label>{translation("vocabulary-screen.levels")}</label>}
							labelPlacement="outside"
							placeholder={translation("vocabulary-screen.levels-selection-placeholder")}
							variant="bordered"
							onChange={handleChangeGroup}
							radius="sm"
							className="bg-white rounded-small"
							selectedKeys={[selectedGroup]}
							items={vocabularyQuery?.data}>
							{vocabularyQuery?.data?.vocabularyList?.map((item) => (
								<SelectItem value={item?.levelId.toString()} key={item?.levelId.toString()}>
									{item?.levelName}
								</SelectItem>
							))}
						</Select>
					</div>

					{/* Add Button */}
					{!wordEditing.isEditing ? (
						<Button
							isLoading={addWordMutation.isPending}
							type="submit"
							radius="sm"
							className="mt-4 bg-secondary text-secondary-foreground">
							{translation("vocabulary-screen.add")}
						</Button>
					) : (
						<div className="flex space-x-2">
							<Button type="reset" color="default" radius="sm" onClick={clearFormWord} className="mt-4">
								{translation("vocabulary-screen.cancel")}
							</Button>
							<Button
								isLoading={updateWordMutation.isPending}
								type="submit"
								radius="sm"
								className="mt-4 bg-secondary text-secondary-foreground">
								{translation("vocabulary-screen.update")}
							</Button>
						</div>
					)}
				</form>

				<div className="w-3/4 border rounded-lg overflow-hidden">
					<div className="grid grid-cols-12 bg-blue-100 p-2 gap-x-1">
						<span className="font-bold text-blue-400 col-span-3 ">
							{translation("vocabulary-screen.table.word")}
						</span>
						<span className="font-bold text-blue-400 col-span-3 ml-4">
							{translation("vocabulary-screen.table.definition")}
						</span>
						<span className="font-bold text-blue-400 col-span-1 justify-self-center">
							{translation("vocabulary-screen.table.audio")}
						</span>
						<span className="font-bold text-blue-400 col-span-1 justify-self-center">
							{translation("vocabulary-screen.table.image")}
						</span>
						<span className="font-bold text-blue-400 col-span-2 justify-self-start">
							{translation("vocabulary-screen.table.transcription")}
						</span>
						<span className="font-bold text-blue-400 col-span-2 justify-self-end">
							{translation("vocabulary-screen.table.action")}
						</span>
					</div>
					<Accordion className="bg-blue-100" selectionMode="multiple">
						{vocabularyQuery.data?.vocabularyList?.map((item) => {
							return (
								<AccordionItem
									key={item?.levelId}
									title={<span className="underline">{item?.levelName}</span>}
									disableIndicatorAnimation={true}
									indicator={({ isOpen }) =>
										isOpen ? (
											<div className="flex items-center text-blue-400 font-bold gap-4">
												<span>{translation("vocabulary-screen.table.hide")}</span>
												<span
													className="hover:underline"
													onClick={() => handleRenameLevel(item?.levelId, item?.levelName)}>
													{translation("vocabulary-screen.table.rename")}
												</span>
												<span
													className="hover:underline"
													onClick={() =>
														showDeleteConfirmation({
															type: "group",
															groupId: item?.levelId,
														})
													}>
													{translation("vocabulary-screen.table.delete")}
												</span>
											</div>
										) : (
											<div className="flex items-center text-blue-400 font-bold gap-4">
												<span>{translation("vocabulary-screen.table.show")}</span>
												<span
													className="hover:underline"
													onClick={() => handleRenameLevel(item?.levelId, item?.levelName)}>
													{translation("vocabulary-screen.table.rename")}
												</span>
												<span
													className="hover:underline"
													onClick={() =>
														showDeleteConfirmation({
															type: "group",
															groupId: item?.levelId,
														})
													}>
													{translation("vocabulary-screen.table.delete")}
												</span>
											</div>
										)
									}>
									<ul>
										{item?.words?.map((word, index) => {
											const handleEdit = () =>
												handleEditWord({
													levelId: item?.levelId,
													wordId: word?.wordId,
													word: word?.word,
													pronunciation: word?.pronunciation,
													type: word?.type,
													image: word?.image,
													definition: word?.definition,
													transcription: word?.transcription,
												});

											const handleShowConfirmDeletion = () =>
												showDeleteConfirmation({
													type: "vocab",
													levelId: item?.levelId,
													wordId: word?.wordId,
												});
											return (
												<WordListEdit
													key={index}
													index={index}
													word={word}
													handleEdit={handleEdit}
													handleDeleteConfirmation={handleShowConfirmDeletion}
												/>
											);
										})}
									</ul>
								</AccordionItem>
							);
						})}
					</Accordion>

					{showGroupInput && (
						<form className="flex items-center mt-4 bg-gray-100 p-3 rounded-md gap-2" onSubmit={saveGroup}>
							<Input
								variant="bordered"
								type="text"
								value={groupName}
								onValueChange={setGroupName}
								placeholder={translation("vocabulary-screen.table.add-level-placeholder")}
								radius="sm"
								className="bg-white rounded-small"
								size="lg"
							/>
							<Button
								type="submit"
								className="bg-third text-third-foreground"
								radius="sm"
								size="lg"
								isLoading={addLevelMutation.isPending}>
								{translation("vocabulary-screen.update")}
							</Button>
						</form>
					)}
				</div>
			</div>
			{/* {showTextModal && (
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
							placeholder="Nhập hoặc dán ở đây..."></textarea>
						<div className="flex justify-end">
							<button
								onClick={() => setShowTextModal(false)}
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2">
								Hủy
							</button>
							<button className="px-4 py-2 bg-gray-500 text-white rounded-md">Thêm</button>
						</div>
					</div>
				</div>
			)} */}
			{/* File Modal */}?{/* Delete Confirmation Modal */}
			<Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{translation("vocabulary-screen.table.delete-confirmation")}
							</ModalHeader>
							<ModalBody>
								<p className="text-gray-500 mb-4">
									{translation("vocabulary-screen.table.delete-message")}&nbsp;
									{deleteContext?.type === "group"
										? translation("vocabulary-screen.table.this-group")
										: translation("vocabulary-screen.table.this-word")}
									?
								</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="default"
									variant="light"
									onPress={onClose}
									radius="sm"
									className="bg-gray-200">
									{translation("vocabulary-screen.cancel")}
								</Button>
								<Button
									color="danger"
									variant="solid"
									onPress={handleConfirmDelete}
									radius="sm"
									isLoading={removeLevelMutation.isPending}>
									{translation("vocabulary-screen.table.delete")}
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
							<form onSubmit={handleUpdateLevelName}>
								<ModalHeader className="flex flex-col gap-1">
									{translation("vocabulary-screen.table.rename-word")}
								</ModalHeader>
								<ModalBody>
									<Input
										type="text"
										value={renameLevel.levelName}
										onChange={(e) =>
											setRenameLevel((prev) => ({
												...prev,
												levelName: e.target.value,
											}))
										}
									/>
								</ModalBody>
								<ModalFooter>
									<Button
										color="default"
										variant="light"
										onPress={onClose}
										radius="sm"
										className="bg-gray-200">
										{translation("vocabulary-screen.cancel")}
									</Button>
									<Button
										type="submit"
										color="danger"
										variant="solid"
										radius="sm"
										isLoading={updateLevelNameMutation.isPending}>
										{translation("vocabulary-screen.update")}
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

export default CourseVocabulary;
