import clsx from "clsx";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { IoEyeOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import React, { useContext, useRef, useState } from "react";
import { ExerciseManager } from "./exercise-manager.jsx";
import { DetailExerciseModal } from "./detail-exercise-modal.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExerciseService } from "../apis/exercise.api.js";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../providers/GlobalStateProvider.jsx";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { queryKeys } from "../react-query/query-keys.js";
import { div } from "framer-motion/client";
import { ExerciseContext } from "../screen/list-excercise.jsx";

const DeleteModal = ({ isOpen, onClose, handleDelete, isLoading }) => {
	return <Modal isOpen={isOpen} onClose={onClose}>
		<ModalContent>
			<ModalHeader>
				Delete confirm
			</ModalHeader>
			<ModalBody>
				Are you sure to delete this exercise?
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" onClick={handleDelete} radius="sm">Delete</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>;
};

const ItemExercise = (
	{
		title = "", question = "", answer = "", explanation = "",
		optionA = "", optionB = "", optionC = "", optionD = "",
		levelName = "", image = null, audio = null, type = "",
		difficulty = "", courseId, levelId, exerciseId,
	}) => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const { courseIdKey, levelIdKey } = useContext(ExerciseContext);

	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);

	const clientQuery = useQueryClient();

	const editExerciseModalRef = useRef(null);

	const updateExerciseMutation = useMutation({
		mutationFn: async (payload) => {
			return await ExerciseService.updateExercise(payload, user, updateUserState);
		},
		onSuccess: (data) => {
			let exercises = clientQuery.getQueryData([queryKeys.exercise, courseIdKey, levelIdKey]) || [];
			for (let i = 0; i < exercises.length; i++) {
				if (exercises[i]?.["exercise id"] === data?.["updatedExercise"]?.["exercise id"]) {
					exercises[i] = data?.["updatedExercise"];
					break;
				}
			}

			clientQuery.setQueryData([queryKeys.exercise, courseIdKey, levelIdKey], []); // thay đổi để trigger useEffect bắt dấu hiệu thay đổi
			clientQuery.setQueryData([queryKeys.exercise, courseIdKey, levelIdKey], exercises);
			setShowEditModal(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const deleteExerciseMutation = useMutation({
		mutationFn: async ({ exerciseId, courseId, levelId }) => {
			const data = await ExerciseService.deleteExercise({ exerciseId, courseId, levelId }, user, updateUserState);
			return { ...data, exerciseId, courseId, levelId };
		},
		onSuccess: (data) => {
			let exercises = clientQuery.getQueryData([queryKeys.exercise, courseIdKey, levelIdKey]) || [];
			exercises = exercises.filter(item => item?.["exercise id"] !== data?.exerciseId);
			// update lại query state
			clientQuery.setQueryData([queryKeys.exercise, courseIdKey, levelIdKey], exercises);
			setShowDeleteConfirmModal(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const handleShowEditModal = () => {
		if (!editExerciseModalRef.current)
			return;
		// set value form cho cau hoi multiple choice
		if (type === "multiple-choices") {
			editExerciseModalRef.current.setDifficulty(difficulty);
			editExerciseModalRef.current.setTypeQuestion(type);
			editExerciseModalRef.current.setQuestionMultipleChoices(question);
			editExerciseModalRef.current.setAnswerMultipleChoices(answer);
			editExerciseModalRef.current.setOptionAMultipleChoices(optionA);
			editExerciseModalRef.current.setOptionBMultipleChoices(optionB);
			editExerciseModalRef.current.setOptionCMultipleChoices(optionC);
			editExerciseModalRef.current.setOptionDMultipleChoices(optionD);
			editExerciseModalRef.current.setImageMultipleChoices(image);
			editExerciseModalRef.current.setAudioMultipleChoices(audio);
			editExerciseModalRef.current.setTitleMultipleChoices(title);
			editExerciseModalRef.current.setExplanationMultipleChoices(explanation);
		} else if (type === "fill-in-blank") {
			editExerciseModalRef.current.setDifficulty(difficulty);
			editExerciseModalRef.current.setTypeQuestion(type);
			editExerciseModalRef.current.setQuestionFillInBlank(question);
			editExerciseModalRef.current.setAnswerFillInBlank(answer);
			editExerciseModalRef.current.setImageFillInBlank(image);
			editExerciseModalRef.current.setAudioFillInBlank(audio);
			editExerciseModalRef.current.setTitleFillInBlank(title);
			editExerciseModalRef.current.setExplanationFillInBlank(explanation);
		}
		setShowEditModal(true);
	};

	const handleUpdateSubmit = (e) => {
		e.preventDefault();

		let typeQues = editExerciseModalRef.current.getTypeQuestion();
		let updatedDifficulty = editExerciseModalRef.current.getDifficulty();
		// form value dua theo type question
		let formValue = typeQues === "multiple-choices" ? editExerciseModalRef.current.getFormValueMultipleChoices() : editExerciseModalRef.current.getFormValueFillInBlank();
		let options = typeQues === "multiple-choices" ? `${formValue?.optionA}\\n${formValue?.optionB}\\n${formValue?.optionC}\\n${formValue?.optionD}` : null;
		console.log({ updatedDifficulty });
		updateExerciseMutation.mutate({
			courseId: courseId,
			levelId: levelId,
			exerciseId: exerciseId,
			difficultyLevel: updatedDifficulty,
			questionText: formValue?.question,
			answerText: formValue?.answer,
			image: formValue?.image,
			audio: formValue?.audio,
			splitChar: "\\n",
			explanation: formValue?.explanation,
			options: options,
			title: formValue?.title,
		});
	};

	const handleDeleteSubmit = (e) => {
		e.preventDefault();
		deleteExerciseMutation.mutate({ exerciseId, levelId, courseId });
	};

	return <div
		className="flex items-center justify-between border-1 border-gray-400 px-4 py-2 rounded-small shadow-small">
		<div>
			<p className="line-clamp-1 text-primary">{title}</p>
			<p className="line-clamp-1">{question}</p>
			<div className="flex items-center gap-2">
				<span
					className="font-light text-sm">{type.split("-").reduce((acc, curr) => acc + " " + curr, "")}</span>&#x2022;
				<span className="font-bold text-sm">{levelName}</span>&#x2022;
				<span
					className={clsx("font-light text-sm", difficulty === "easy" ? "text-green-500" : difficulty === "medium" ? "text-warning-500" : difficulty === "hard" ? "text-danger-500" : "text-black")}>{difficulty}</span>
			</div>
		</div>
		<div className="flex items-center">
			<Tooltip content="View details" placement="bottom" radius="sm">
				<Button isIconOnly={true} variant="light" size="sm" onClick={() => {
					setShowDetailModal(true);
				}}>
					<IoEyeOutline className="text-green-500 size-6" />
				</Button>
			</Tooltip>
			<Tooltip content="Edit" placement="bottom" radius="sm">
				<Button isIconOnly={true} variant="light" size="sm" onClick={handleShowEditModal}>
					<IoPencilOutline className="text-blue-500 size-6" />
				</Button>
			</Tooltip>
			<Tooltip content="Delete" placement="bottom" radius="sm">
				<Button isIconOnly={true} variant="light" size="sm" onClick={() => {
					setShowDeleteConfirmModal(true);
				}}>
					<IoTrashOutline className="text-red-500 size-6" />
				</Button>
			</Tooltip>
		</div>
		<DetailExerciseModal
			isOpen={showDetailModal}
			onClose={() => {
				setShowDetailModal(false);
			}}
			type={type}
			question={question}
			answer={answer}
			optionA={optionA}
			optionB={optionB}
			optionC={optionC}
			optionD={optionD}
			audio={audio}
			image={image}
			explanation={explanation}
			title={title}
			levelName={levelName}
			difficulty={difficulty}
		/>
		<DeleteModal isOpen={showDeleteConfirmModal} onClose={() => {
			setShowDeleteConfirmModal(false);
		}} handleDelete={handleDeleteSubmit} isLoading={deleteExerciseMutation.isPending} />
		<ExerciseManager ref={editExerciseModalRef} isOpen={showEditModal} onClose={() => {
			setShowEditModal(false);
		}}
						 action="edit" handleSubmit={handleUpdateSubmit} isLoading={updateExerciseMutation.isPending} />
	</div>;
};

export { ItemExercise };