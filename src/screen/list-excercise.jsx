import { Button } from "@nextui-org/button";
import { Input, Select } from "@nextui-org/react";
import { RxMagnifyingGlass } from "react-icons/rx";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { div } from "framer-motion/client";
import { SidebarListExercise } from "../components/sidebar-listexercise.jsx";
import { useParams } from "react-router-dom";
import { ExerciseManager } from "../components/exercise-manager.jsx";
import { ItemExercise } from "../components/item-exercise.jsx";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../react-query/query-keys.js";
import { CourseLevelService } from "../apis/courseLevel.api.js";
import { toast } from "react-toastify";
import { ExerciseService } from "../apis/exercise.api.js";
import clsx from "clsx";
import { SelectItem } from "@nextui-org/select";

export const ExerciseContext = createContext({});

const difficulties = [
	{ key: "easy", title: "Easy", color: "success" },
	{ key: "medium", title: "Medium", color: "warning" },
	{ key: "hard", title: "Hard", color: "danger" },
];

const typeQuestions = [
	{ key: "multiple-choices", title: "Multiple choices" },
	{ key: "fill-in-blank", title: "Fill in blank" },
];

const ListExercise = () => {
	const params = useParams();
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);

	const clientQuery = useQueryClient();

	const [showInsertModal, setShowInsertModal] = useState(false);
	const [selectedLevel, setSelectedLevel] = useState();
	const [exercises, setExercises] = useState([]);
	const [search, setSearch] = useState("");
	const [filterTypeQuestion, setFilterTypeQuestion] = useState("");
	const [difficulty, setDifficulty] = useState("");

	const insertModalRef = useRef(null);

	const levelQuery = useQuery({
		queryKey: [queryKeys.level, params?.courseId],
		queryFn: async ({ queryKey }) => {
			if (!queryKey[1]) return [];
			try {
				const data =
					(await CourseLevelService.fetchCourseLevelByCourse(queryKey[1], user, updateUserState)) || [];
				return data?.levels;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const exerciseQuery = useQuery({
		queryKey: [queryKeys.exercise, params?.courseId?.toString(), selectedLevel?.toString()],
		queryFn: async ({ queryKey }) => {
			try {
				const data = await ExerciseService.getExerciseByCourse(
					{
						courseId: queryKey[1],
						levelId: queryKey[2],
					},
					user,
					updateUserState,
				);
				return data?.exercises;
			} catch (error) {
				console.error(error);
				toast.error(translation(error.response.data?.errorCode));
			}
		},
	});

	const addNewExerciseMutation = useMutation({
		mutationFn: async (payload) => {
			return await ExerciseService.addNewExercise(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			let exercises =
				clientQuery.getQueryData([
					queryKeys.exercise,
					params?.courseId?.toString(),
					selectedLevel?.toString(),
				]) || [];
			exercises.push(data?.["newExercise"]);

			clientQuery.setQueryData(
				[queryKeys.exercise, params?.courseId?.toString(), selectedLevel?.toString()],
				exercises,
			);
			setShowInsertModal(false);
			insertModalRef.current.resetFormValue();
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	// cap nhat exercises state khi query co du lieu moi
	useEffect(() => {
		// filter exercises theo search
		let filters =
			search || difficulty || filterTypeQuestion
				? exerciseQuery.data?.filter((item) => {
						console.log(difficulty);
						const filter1 = filterTypeQuestion ? item?.["exercise type"] === filterTypeQuestion : true;
						const filter2 = difficulty ? item?.["difficult_level"] === difficulty : true;
						const filter3 = search
							? item?.["title"]?.toUpperCase()?.includes(search?.toUpperCase()) ||
							  item?.["question"]?.toUpperCase()?.includes(search?.toUpperCase())
							: true;
						return filter1 && filter2 && filter3;
				  })
				: exerciseQuery.data;
		setExercises(filters);
	}, [difficulty, exerciseQuery.data, filterTypeQuestion, search]);

	const handleOpenInsertModal = () => {
		if (selectedLevel === null || selectedLevel === undefined) {
			toast.warn(translation("list-exercise.select-level-before"));
		} else {
			setShowInsertModal(true);
		}
	};
	const handleInsertQuestion = (e) => {
		e.preventDefault();
		let typeQuestion = insertModalRef.current.getTypeQuestion();
		let difficulty = insertModalRef.current.getDifficulty();
		if (typeQuestion === "multiple-choices") {
			let formValue = insertModalRef.current.getFormValueMultipleChoices();
			addNewExerciseMutation.mutate({
				courseId: params?.courseId,
				levelId: selectedLevel,
				exerciseType: typeQuestion,
				difficultyLevel: difficulty,
				questionText: formValue.question,
				answerText: formValue.answer,
				image: formValue.image,
				audio: formValue.audio,
				splitChar: "\\n",
				explanation: formValue.explanation,
				options: `${formValue.optionA}\\n${formValue.optionB}\\n${formValue.optionC}\\n${formValue.optionD}`,
				title: formValue.title,
			});
		} else if (typeQuestion === "fill-in-blank") {
			let formValue = insertModalRef.current.getFormValueFillInBlank();
			addNewExerciseMutation.mutate({
				courseId: params?.courseId,
				levelId: selectedLevel,
				exerciseType: typeQuestion,
				difficultyLevel: difficulty,
				questionText: formValue.question,
				answerText: formValue.answer,
				image: formValue.image,
				audio: formValue.audio,
				explanation: formValue.explanation,
				title: formValue.title,
			});
		}
	};

	return (
		<ExerciseContext.Provider
			value={{ courseIdKey: params?.courseId?.toString(), levelIdKey: selectedLevel?.toString() }}>
			<div className="grid grid-cols-12 gap-4 h-full">
				<div className="flex flex-col col-span-10">
					<div className="flex gap-4">
						<Button className="px-8" color="primary" radius="sm" onClick={handleOpenInsertModal}>
							Add new
						</Button>
						<Input
							type="text"
							radius="sm"
							placeholder="Search by exercise title"
							className="col-span-2 row-start-2 border-spacing-2"
							startContent={
								<RxMagnifyingGlass className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0 size-6" />
							}
							value={search}
							onValueChange={setSearch}
						/>
						<Select
							aria-label="difficulty"
							type="text"
							radius="sm"
							placeholder="Difficulty"
							className="col-span-2 row-start-2 border-spacing-2 min-w-40 w-40"
							selectedKeys={[difficulty?.toString()]}
							value={difficulty}
							onChange={(e) => setDifficulty(e.target.value)}>
							{difficulties?.map((difficulty) => (
								<SelectItem color={difficulty?.color} key={difficulty?.key}>
									{difficulty?.title}
								</SelectItem>
							))}
						</Select>
						<Select
							aria-label="type-question"
							type="text"
							radius="sm"
							placeholder="Type question"
							className="col-span-2 row-start-2 border-spacing-2 min-w-40 w-40"
							selectedKeys={[filterTypeQuestion?.toString()]}
							value={filterTypeQuestion}
							onChange={(e) => setFilterTypeQuestion(e.target.value)}>
							{typeQuestions?.map((type) => (
								<SelectItem key={type?.key}>{type?.title}</SelectItem>
							))}
						</Select>
					</div>
					<div
						className={clsx(
							"py-4",
							exercises?.length > 0 ? "grid gap-4 lg:grid-cols-2 sm:grid-cols-1" : "",
						)}>
						{exercises?.length > 0 ? (
							exercises?.map((item) => {
								let options = item?.["option text"]?.split(item?.["split char"]);
								let optionA, optionB, optionC, optionD;
								if (options?.length > 0) {
									optionA = options[0];
									optionB = options[1];
									optionC = options[2];
									optionD = options[3];
								}
								return (
									<ItemExercise
										key={item?.["exercise id"]}
										type={item?.["exercise type"]}
										question={item?.["question"]}
										answer={item?.["answer text"]}
										optionA={optionA}
										optionB={optionB}
										optionC={optionC}
										optionD={optionD}
										audio={item?.["audio"]}
										image={item?.["image"]}
										explanation={item?.["explanation"]}
										title={item?.["title"]}
										levelName={item?.["level name"]}
										difficulty={item?.["difficult_level"]}
										courseId={item?.["course id"]}
										levelId={item?.["level id"]}
										exerciseId={item?.["exercise id"]}
									/>
								);
							})
						) : (
							<div className="italic text-center font-light">(Empty)</div>
						)}
					</div>
				</div>
				<div className="col-span-2 h-full">
					<SidebarListExercise
						levels={levelQuery.data}
						selectedLevels={selectedLevel}
						setSelectedLevels={setSelectedLevel}
					/>
				</div>
				<ExerciseManager
					ref={insertModalRef}
					isOpen={showInsertModal}
					onClose={() => {
						setShowInsertModal(false);
					}}
					handleSubmit={handleInsertQuestion}
					isLoading={addNewExerciseMutation.isPending}
				/>
			</div>
		</ExerciseContext.Provider>
	);
};

export default ListExercise;
