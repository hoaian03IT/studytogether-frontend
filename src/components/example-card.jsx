import React, { useState, useContext } from "react";
import { Input, Textarea, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { RxDotsVertical } from "react-icons/rx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExampleService } from "../apis/example.api";
import { queryKeys } from "../react-query/query-keys";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";
import { TranslationContext } from "../providers/TranslationProvider";
import { toast } from "react-toastify";

const ExampleCard = ({ courseId, exampleId, wordId, title, example, explanation }) => {
	const user = useRecoilValue(userState);
	const { updateUserState } = useContext(GlobalStateContext);
	const { translation } = useContext(TranslationContext);
	const clientQuery = useQueryClient();

	const [editable, setEditable] = useState(false);
	const [formValue, setFormValue] = useState({ title, example, explanation });

	const updateExampleMutation = useMutation({
		mutationFn: async () =>
			await ExampleService.updateExample({ courseId, exampleId, wordId, ...formValue }, user, updateUserState),
		onSuccess: ({ updatedExample }) => {
			const examples = clientQuery.getQueryData([queryKeys.exampleByWord, courseId, wordId]) || [];
			const updatedExamples = examples.map((item) =>
				item["example id"] === updatedExample["example id"] ? updatedExample : item,
			);
			clientQuery.setQueryData([queryKeys.exampleByWord, courseId, wordId], updatedExamples);
			setEditable(false);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const deleteExampleMutation = useMutation({
		mutationFn: async () =>
			await ExampleService.deleteExample({ courseId, wordId, exampleId }, user, updateUserState),
		onSuccess: () => {
			const examples = clientQuery.getQueryData([queryKeys.exampleByWord, courseId, wordId]) || [];
			const filteredExamples = examples.filter((item) => item["example id"] !== exampleId);
			clientQuery.setQueryData([queryKeys.exampleByWord, courseId, wordId], filteredExamples);
		},
		onError: (error) => {
			console.error(error);
			toast.error(translation(error.response.data?.errorCode));
		},
	});

	const handleEdit = () => setEditable(true);
	const handleCancel = () => {
		setFormValue({ title, example, explanation });
		setEditable(false);
	};
	const handleDelete = () => deleteExampleMutation.mutate();
	const handleSave = () => updateExampleMutation.mutate();

	const onChange = (e) => setFormValue({ ...formValue, [e.target.name]: e.target.value });

	return (
		<div className='gap-2 p-4'>
			<div className='flex gap-2'>
				<div className='flex-1 space-y-2'>
					<Input
						name='title'
						label='Title'
						variant={editable ? "bordered" : "faded"}
						radius='none'
						value={formValue.title}
						onChange={onChange}
						disabled={!editable}
					/>
					<Textarea
						name='example'
						label='Example'
						variant={editable ? "bordered" : "faded"}
						radius='none'
						value={formValue.example}
						onChange={onChange}
						disabled={!editable}
					/>
					<Textarea
						name='explanation'
						label='Explanation'
						variant={editable ? "bordered" : "faded"}
						radius='none'
						value={formValue.explanation}
						onChange={onChange}
						disabled={!editable}
					/>
				</div>
				{!editable && (
					<Dropdown radius='sm'>
						<DropdownTrigger>
							<Button isIconOnly radius='none'>
								<RxDotsVertical />
							</Button>
						</DropdownTrigger>
						<DropdownMenu>
							<DropdownItem onClick={handleEdit}>Edit</DropdownItem>
							<DropdownItem onClick={handleDelete}>Delete</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}
			</div>
			{editable && (
				<div className='flex justify-end gap-2 mt-2'>
					<Button onClick={handleCancel} radius='sm' size='sm'>
						Cancel
					</Button>
					<Button onClick={handleSave} radius='sm' size='sm' color='secondary'>
						Save
					</Button>
				</div>
			)}
		</div>
	);
};

export { ExampleCard };
