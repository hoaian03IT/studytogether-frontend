import React, { useState, useContext } from "react";
import { Input, Textarea, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { RxDotsVertical } from "react-icons/rx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExampleService } from "../apis/example.api";
import { queryKeys } from "../react-query/query-keys";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom";
import { GlobalStateContext } from "../providers/GlobalStateProvider";

const ExampleCard = ({ courseId, exampleId, wordId, title, example, explanation }) => {
  const user = useRecoilValue(userState);
  const { updateUserState } = useContext(GlobalStateContext);
  const clientQuery = useQueryClient();

  const [editable, setEditable] = useState(false);
  const [formValue, setFormValue] = useState({ title, example, explanation });

  const updateExampleMutation = useMutation({
    mutationFn: async () =>
      await ExampleService.updateExample(
        { courseId, exampleId, wordId, ...formValue },
        user,
        updateUserState
      ),
    onSuccess: ({ updatedExample }) => {
      const examples = clientQuery.getQueryData([queryKeys.exampleByWord, courseId, wordId]) || [];
      const updatedExamples = examples.map((item) =>
        item["example id"] === updatedExample["example id"] ? updatedExample : item
      );
      clientQuery.setQueryData([queryKeys.exampleByWord, courseId, wordId], updatedExamples);
      setEditable(false);
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
    <div className="flex flex-col gap-4 p-4 border rounded">
      <Input
        name="title"
        label="Title"
        value={formValue.title}
        onChange={onChange}
        disabled={!editable}
      />
      <Textarea
        name="example"
        label="Example"
        value={formValue.example}
        onChange={onChange}
        disabled={!editable}
      />
      <Textarea
        name="explanation"
        label="Explanation"
        value={formValue.explanation}
        onChange={onChange}
        disabled={!editable}
      />
      {editable ? (
        <div className="flex gap-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      ) : (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly>
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
  );
};

export { ExampleCard };
