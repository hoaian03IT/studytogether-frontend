import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { generateRandomLetter } from "../utils/randomLetterFromAnswerAndQuestion.js";
import { Button } from "@nextui-org/react";
import { FaRegSadCry, FaRegThumbsUp } from "react-icons/fa";
import { Audio } from "./audio.jsx";

export const TextQuiz = forwardRef(({ question, answer, audio, isCorrect, handleCheckResult, rd }, ref) => {
	const [value, setValue] = useState("");
	const [randomLetters, setRandomLetters] = useState(generateRandomLetter(question, answer));
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		setValue("");
		setIsSubmitted(false);
		setRandomLetters(generateRandomLetter(question, answer));
	}, [rd]);

	useImperativeHandle(ref, () => {
		return {
			submit: () => {
				handleSubmit();
			},
		};
	}, [value]);

	const handleChooseLetter = (e) => {
		const { value } = e.target;
		setValue(prev => `${prev}${value}`);
	};

	const handleSubmit = (e) => {
		if (e) {
			e.preventDefault();
		}
		if (isSubmitted) {
			return;
		}
		handleCheckResult(value.trim().toLowerCase() === answer.trim().toLowerCase());
		setIsSubmitted(true);
	};

	return <div>
		<form onSubmit={handleSubmit}>
			<h2 className="text-4xl font-bold mb-6 flex flex-col items-center justify-center gap-2">{question} {audio &&
				<Audio src={audio} show={!!audio} rd={rd} />}
			</h2>
			<input
				className="h-14 w-full text-4xl p-4 bg-white rounded-lg border-2 border-primary active:border-blue-500 focus:border-blue-500"
				value={value}
				autoFocus={true}
				disabled={isSubmitted}
				onChange={e => setValue(e.target.value)}
				required
			/>
			<div className="my-10 w-full flex gap-2 justify-center">
				{randomLetters?.map((letter, index) =>
					<Button type="button" key={index} aria-label={index} value={letter} className="bg-white text-2xl"
							variant="shadow" size="lg"
							onClick={handleChooseLetter}
							isIconOnly>{letter}</Button>)}
			</div>
			{!isSubmitted && <div className="flex justify-center">
				<Button type="submit" size="lg" color="primary" variant="shadow"
						className="text-2xl">Submit</Button>
			</div>}
			{isSubmitted ? isCorrect ? <div
				className="w-full h-20 bg-success-200 text-success-600 text-4xl flex items-center justify-center gap-2 rounded-medium">
				<FaRegThumbsUp className="size-10" /> Great job!</div> : <div
				className="w-full h-20 bg-danger-100 text-danger-600 text-4xl flex items-center justify-center gap-2 rounded-medium">
				<FaRegSadCry className="size-10" /> The correct is: <strong
				className="font-bold underline">{answer}</strong></div> : <div></div>}
		</form>
	</div>;
});