import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { forwardRef, useContext, useState } from "react";
import { TranslationContext } from "../providers/TranslationProvider";
import { Rating } from "./rating";
import { useImperativeHandle } from "react";

const LIMIT_FEEDBACK = 300;
export const FeedbackModal = forwardRef(({ show, onClose, onSubmit }, ref) => {
	const { translation } = useContext(TranslationContext);
	const [feedback, setFeedback] = useState("");
	const [rate, setRate] = useState(5);

	useImperativeHandle(
		ref,
		() => {
			return {
				getRate() {
					return rate;
				},
				getFeedback() {
					return feedback;
				},
			};
		},
		[feedback, rate],
	);

	const handleOnChange = (e) => {
		if (e.target.value.length <= LIMIT_FEEDBACK) {
			setFeedback(e.target.value);
		}
	};

	// submit feedback here
	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit();
		onClose();
	};
	return (
		<Modal isOpen={show} onClose={onClose} radius="sm">
			<ModalContent>
				<form onSubmit={handleSubmit}>
					<ModalHeader>{translation("feedback-modal.title")}</ModalHeader>
					<ModalBody>
						<Rating
							className="flex justify-center mb-2"
							stars={5}
							value={rate}
							setValue={setRate}
							size="sm"
						/>
						<Textarea
							variant="flat"
							value={feedback}
							onChange={handleOnChange}
							radius="sm"
							size="lg"
							rows={8}
							disableAutosize
							placeholder={translation("feedback-modal.textarea-placeholder")}></Textarea>
						<span className="ml-auto text-[10px] text-gray-500">
							{feedback.length}/{LIMIT_FEEDBACK}
						</span>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" radius="sm" type="submit">
							{translation("feedback-modal.submit")}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
});
