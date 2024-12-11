import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExampleService } from "../apis/example.api.js";
import { ChatGPTService } from "../apis/chatgpt.api.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { ExampleCard } from "../components/example-card.jsx";
import clsx from "clsx";
import { queryKeys } from "../react-query/query-keys.js";
import { VocabularyService } from "../apis/vocabulary.api.js";
import { toast } from "react-toastify";

const ListExamples = () => {
	const params = useParams();
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const [open, setOpen] = useState(false);
	const [selectedWord, setSelectedWord] = useState({ word: null, wordId: null });
	const [formValue, setFormValue] = useState({
		title: "",
		example: "",
		explanation: "",
	});

	const [vocabularyFilter, setVocabularyFilter] = useState([]);

	const [exampleSuggestions, setExampleSuggestions] = useState([]);
	const [explanationSuggestions, setExplanationSuggestions] = useState([]);
	const [searches, setSearches] = useState({
		searchWord: "",
		searchLevel: "",
	});

	const clientQuery = useQueryClient();
	const vocabularyList = clientQuery.getQueryData([queryKeys.courseVocabulary, params?.courseId]);
	const vocabularyQuery = useQuery({
		queryKey: [queryKeys.courseVocabulary, params?.courseId],
		queryFn: async ({ queryKey }) => {
			try {
				let data = await VocabularyService.fetchVocabulary(queryKey[1], user, updateUserState);
				setVocabularyFilter(data);
				return data;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
		enabled: !vocabularyList,
		initialData: vocabularyList,
	});

	const exampleByWordQuery = useQuery({
		queryKey: [queryKeys.exampleByWord, params?.courseId, selectedWord?.wordId],
		queryFn: async () => {
			if (!selectedWord?.wordId) return null;
			const { examples } = await ExampleService.fetchExamples(
				{
					courseId: params?.courseId,
					wordId: selectedWord?.wordId,
				},
				user,
				updateUserState,
			);
			return examples;
		},
		enabled: !!selectedWord?.wordId,
		initialData: [],
	});

	const addExampleMutation = useMutation({
		mutationFn: async () => {
			return await ExampleService.addNewExample(
				{
					courseId: params?.courseId,
					wordId: selectedWord.wordId,
					title: formValue.title,
					example: formValue.example,
					explanation: formValue.explanation,
				},
				user,
				updateUserState,
			);
		},
		onSuccess: ({ newExample }) => {
			const newExamples = exampleByWordQuery.data || [];
			newExamples.push(newExample);
			clientQuery.setQueryData([queryKeys.exampleByWord, params?.courseId, selectedWord.wordId], newExamples);
			clearFormSubmit();
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const suggestExampleMutation = useMutation({
		mutationFn: async () => ChatGPTService.suggestExample(selectedWord.word),
		onSuccess: (data) => {
			setExampleSuggestions(data.suggestions || []);
		},
		onError: (error) => {
			console.error(error);
			toast.error("Failed to generate example suggestions.");
		},
	});

	const suggestExplanationMutation = useMutation({
		mutationFn: async () => ChatGPTService.suggestExplanation(formValue.example),
		onSuccess: (data) => {
			setExplanationSuggestions(data.suggestions || []);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response?.data?.errorCode));
		},
	});

	useEffect(() => {
		let filters = searches.searchLevel
			? vocabularyQuery.data?.filter((item) => {
					return item?.["levelName"].toLowerCase().includes(searches.searchLevel.toLowerCase());
			  })
			: vocabularyQuery.data;

		setVocabularyFilter(filters);
	}, [searches.searchLevel, vocabularyQuery.data]);

	const clearFormSubmit = () => {
		setFormValue({
			example: "",
			explanation: "",
			title: "",
		});
		setOpen(false);
		setExampleSuggestions([]);
		setExplanationSuggestions([]);
	};

	const handleOpen = () => {
		if (!selectedWord.wordId || !selectedWord.word) {
			toast.warn("Please select a word before adding an example.");
			return;
		}
		setOpen(true);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormValue({
			...formValue,
			[name]: value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!selectedWord.wordId || !selectedWord.word) {
			toast.warn("Please select a word before adding an example.");
			return;
		}
		addExampleMutation.mutate();
	};

	return (
		<div className='flex items-start w-full bg-slate-100 gap-5'>
			<div className='w-full'>
				<div className='flex w-full gap-4 mb-5 items-start justify-between'>
					<div className='w-full justify-between'>
						<p>
							Selected word: <strong className='text-secondary'>{selectedWord?.word}</strong>
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<Button onClick={() => setSelectedWord({ word: null, wordId: null })} radius='sm'>
							Clear Selection
						</Button>
						<Button color='primary' onClick={handleOpen} radius='sm'>
							Add Example
						</Button>
					</div>
				</div>

				<div className='flex flex-col w-full rounded bg-slate-200 px-3 shadow-small'>
					<div className='flex flex-col items-center space-y-4 border-1 h-[60vh] overflow-y-auto'>
						{exampleByWordQuery?.data?.map((item, index) => (
							<div key={item?.["example id"]} className='w-full'>
								<span className='ms-3'>{index + 1}.</span>
								<ExampleCard
									courseId={params?.courseId}
									wordId={item?.["word id"]}
									exampleId={item?.["example id"]}
									title={item?.["title"]}
									example={item?.["example sentence"]}
									explanation={item?.["explanation"]}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className='flex flex-col items-center flex-shrink-0 self-stretch rounded-md bg-white border-1 max-w-[400px] w-full px-5 py-4 gap-[30px] shadow-small'>
				<Input
					value={searches.searchLevel}
					onChange={(e) => setSearches({ ...searches, searchLevel: e.target.value })}
					type='text'
					radius='sm'
					placeholder='Search level'
					className='col-span-2 row-start-2 border-spacing-2'
					endContent={
						<RxMagnifyingGlass className='text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6' />
					}
				/>
				<div className='flex flex-col w-full items-center gap-2 h-[60vh] overflow-y-auto'>
					{vocabularyFilter?.map((item) => {
						const words = item.words;
						const level = item?.["levelName"];

						return words.map((word) => (
							<div
								className={clsx(
									"w-full flex flex-col py-[10px] px-3 items-start gap-[5px] rounded border border-[#DBDBDB] bg-white hover:cursor-pointer transition-all",
									selectedWord.wordId === word.wordId ? "bg-orange-50" : "",
								)}
								onClick={() => setSelectedWord({ word: word?.word, wordId: word?.wordId })}
								key={word.wordId}>
								<div className='text-base w-full flex justify-between text-black font-medium'>
									<span>
										{word?.word}({word?.type})
									</span>
									<span className='font-light'>{level}</span>
								</div>
								<div className='flex items-center text-zinc-800 font-medium'>{word?.definition}</div>
							</div>
						));
					})}
				</div>
			</div>

			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={handleSubmit}>
							<ModalHeader>Add Example</ModalHeader>
							<ModalBody className='px-4'>
								<div className='flex flex-col gap-2 py-3 px-2'>
									<Input
										name='title'
										type='text'
										label={<span className='ms-1 text-[12px] text-gray-500'>Title</span>}
										labelPlacement='outside'
										radius='sm'
										value={formValue.title}
										onChange={handleInputChange}
										placeholder='Title'
										required
										isRequired
									/>
									<div>
										<Input
											name='example'
											type='text'
											label={<span className='ms-1 text-[12px] text-gray-500'>Example</span>}
											labelPlacement='outside'
											radius='sm'
											value={formValue.example}
											onChange={handleInputChange}
											placeholder='Example sentence'
											required
											isRequired
										/>
										<div className='text-sm text-gray-500 mt-1'>
											GPT Suggestions:
											<ul className='list-disc pl-4'>
												{exampleSuggestions.map((suggestion, index) => (
													<li
														key={index}
														className='text-blue-500 cursor-pointer hover:underline'
														onClick={() =>
															setFormValue({ ...formValue, example: suggestion })
														}>
														{suggestion}
													</li>
												))}
											</ul>
											<Button
												size='xs'
												variant='ghost'
												onClick={() => suggestExampleMutation.mutate()}>
												Generate Example
											</Button>
										</div>
									</div>
									<div>
										<Textarea
											name='explanation'
											type='text'
											label={<span className='ms-1 text-[12px] text-gray-500'>Explanation</span>}
											labelPlacement='outside'
											radius='sm'
											value={formValue.explanation}
											onChange={handleInputChange}
											placeholder='Explanation'
											required
											isRequired
										/>
										<div className='text-sm text-gray-500 mt-1'>
											GPT Suggestions:
											<ul className='list-disc pl-4'>
												{explanationSuggestions.map((suggestion, index) => (
													<li
														key={index}
														className='text-blue-500 cursor-pointer hover:underline'
														onClick={() =>
															setFormValue({ ...formValue, explanation: suggestion })
														}>
														{suggestion}
													</li>
												))}
											</ul>
											<Button
												size='xs'
												variant='ghost'
												onClick={() => suggestExplanationMutation.mutate()}>
												Generate Explanation
											</Button>
										</div>
									</div>
								</div>
							</ModalBody>
							<ModalFooter className='flex justify-end gap-2'>
								<Button type='reset' onClick={clearFormSubmit} size='sm' className='px-4 py-2 rounded'>
									Cancel
								</Button>
								<Button
									type='submit'
									color='secondary'
									size='sm'
									className='px-4 py-2 rounded'
									isLoading={addExampleMutation.isLoading}>
									Save
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
};

export default ListExamples;
