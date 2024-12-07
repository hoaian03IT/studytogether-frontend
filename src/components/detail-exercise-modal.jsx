import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Audio } from "./audio.jsx";
import clsx from "clsx";
import { Image } from "@nextui-org/image";

export const DetailExerciseModal = (
	{
		isOpen, onClose, title = "", question = "", answer = "", explanation = "",
		optionA = "", optionB = "", optionC = "", optionD = "",
		levelName = "", image = null, audio = null, type = "",
		difficulty = "",
	}) => {
	return <Modal isOpen={isOpen} onClose={onClose} size="xl">
		<ModalContent>
			<ModalHeader>
				Detail exercise
			</ModalHeader>
			<ModalBody className="space-y-1">
				<div className="flex items-center justify-between">
					<p>Difficulty: <strong
						className={clsx("font-light", difficulty === "easy" ? "text-green-500" :
							difficulty === "medium" ? "text-warning-500" :
								difficulty === "hard" ? "text-danger-500" : "text-black")}>
						{difficulty}</strong>
					</p>
					<p>Level: <strong className="font-light">{levelName}</strong></p>
					<p>Type question: <strong className="font-light">{type}</strong></p>
				</div>
				<hr />
				<p>Title: <span className="font-light">{title}</span></p>
				<hr />
				<div>
					<p>Question: <span className="font-light">{question}</span></p>
					{type === "multiple-choices" && <ul>
						<li className={clsx("font-light", answer === "A" ? "text-secondary" : "text-black")}>A: {optionA}</li>
						<li className={clsx("font-light", answer === "B" ? "text-secondary" : "text-black")}>B: {optionB}</li>
						<li className={clsx("font-light", answer === "C" ? "text-secondary" : "text-black")}>C: {optionC}</li>
						<li className={clsx("font-light", answer === "D" ? "text-secondary" : "text-black")}>D:
							New {optionD}</li>
					</ul>}
					<p className="text-secondary">Answer: <span
						className="font-light">{answer}</span></p>
				</div>
				<hr />
				<p>Explanation: <span className="font-light">{explanation || "None"}</span>
				</p>
				<hr />
				<div className="flex items-start gap-8">
					{image && <div className="w-1/2 space-y-4">
						<label>Image:</label>
						<Image src={image}
							   className="border-1 border-gray-300" />
					</div>}
					{!!audio && <div className="w-1/2 space-y-4">
						<label>Audio:</label>
						<Audio src={audio} autoPlay={false} />
					</div>}
				</div>
			</ModalBody>
			<ModalFooter>
				<Button onClick={onClose} color="secondary" radius="sm">Close</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>;
};