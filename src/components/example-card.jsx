import { div } from "framer-motion/client";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { RxDotsVertical } from "react-icons/rx";
import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExampleService } from "../apis/example.api.js";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "./providers/GlobalStateProvider.jsx";
import { queryKeys } from "../react-query/query-keys.js";

const ExampleCard = ({ courseId, exampleId, wordId, title, example, explanation }) => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);

	const clientQuery = useQueryClient();

	const [formValue, setFormValue] = useState({
		exampleId, wordId, title, example, explanation,
	});
	const [editable, setEditable] = useState(false);

	const updateExampleMutation = useMutation({
		mutationFn: async () => {
			return await ExampleService.updateExample({
				courseId,
				exampleId,
				wordId,
				title: formValue?.title,
				example: formValue?.example,
				explanation: formValue?.explanation,
			}, user, updateUserState);
		},
		onSuccess: ({ updatedExample }) => {
			let newExamples = clientQuery.getQueryData([queryKeys.exampleByWord, courseId, wordId]) || [];
			const indexOfUpdatedExample = newExamples.indexOf(item => item?.["example id"] === updatedExample?.["example id"]);
			if (indexOfUpdatedExample >= 0) {
				newExamples[indexOfUpdatedExample]["example sentence"] = updatedExample?.["example sentence"];
				newExamples[indexOfUpdatedExample]["title"] = updatedExample?.["title"];
				newExamples[indexOfUpdatedExample]["explanation"] = updatedExample?.["example sentence"];

			}
			clientQuery.setQueryData([queryKeys.exampleByWord, courseId, wordId], newExamples);
			setEditable(false);
		},
		onError: error => {
			console.error(error);
		},
	});
	const deleteExampleMutation = useMutation({
		mutationFn: async () => {
			await ExampleService.deleteExample({
				courseId,
				wordId,
				exampleId,
			}, user, updateUserState);
			return exampleId;
		},
		onSuccess: (deletedExampleId) => {
			let newExamples = clientQuery.getQueryData([queryKeys.exampleByWord, courseId, wordId]) || [];

			newExamples = newExamples.filter(item => item?.["example id"] !== deletedExampleId);


			clientQuery.setQueryData([queryKeys.exampleByWord, courseId, wordId], newExamples);
			setEditable(false);
		},
		onError: error => {
			console.error(error);
		},
	});

	const onChangeFormValue = (e) => {
		const { name, value } = e.target;
		setFormValue(prev => ({
			...prev,
			[name]: value,
		}));
	};
	const handleEdit = () => {
		setEditable(true);
	};
	const handleDelete = () => {
		deleteExampleMutation.mutate();
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		if (formValue.title === title && formValue.example === example && formValue.explanation === explanation) {
			setEditable(false);
			return;
		}
		updateExampleMutation.mutate();
	};
	const handleCancelUpdate = () => {
		setFormValue({ exampleId, wordId, title, example, explanation });
		setEditable(false);
	};
	return (
		<form className="flex rounded border-[#DBDBDB] bg-white w-full px-3" onSubmit={handleUpdate}>
			<div className="flex flex-col gap-1 w-full">
				<Input name="title" radius="none" label={<p>Tiêu đề</p>} value={formValue?.title}
					   onChange={onChangeFormValue} disabled={!editable}
					   variant={editable ? "underlined" : "faded"}
					   disableAnimation={true} />
				<Input name="example" radius="none" label={<p>Ví dụ</p>} value={formValue?.example}
					   onChange={onChangeFormValue} disabled={!editable}
					   variant={editable ? "underlined" : "faded"}
					   disableAnimation={true} />
				<Textarea name="explanation" radius="none" label={<p>Giải thích</p>} value={formValue?.explanation}
						  onChange={onChangeFormValue}
						  variant={editable ? "underlined" : "faded"}
						  disabled={!editable} disableAnimation={true} />
				{editable && <div className="flex items-center justify-end gap-2">
					<Button radius="none" size="sm" type="submit" onClick={handleCancelUpdate}>Hủy</Button>
					<Button radius="none" size="sm" color="secondary" type="submit"
							isLoading={updateExampleMutation.isPending}>Lưu</Button>
				</div>}
			</div>


			<Dropdown size="sm" className="min-w-16" radius="none">
				<DropdownTrigger>
					<Button isIconOnly variant="light" className="flex-shrink-0" radius="none" disableAnimation>
						<RxDotsVertical />
					</Button>
				</DropdownTrigger>
				<DropdownMenu>
					<DropdownItem className="rounded-none" key="edit" textValue="edit">
						<button onClick={handleEdit}>Sửa</button>
					</DropdownItem>
					<DropdownItem className="rounded-none" key="delete" textValue="delete">
						<button onClick={handleDelete}>Xoá</button>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</form>
	);
};

export { ExampleCard };