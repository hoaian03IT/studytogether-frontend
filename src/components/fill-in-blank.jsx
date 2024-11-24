import React, { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { generateRandomLetter } from "../utils/randomLetterFromAnswerAndQuestion.js";

const Card = ({ children, className }) => (
	<div className={`${className}`}>
		{children}
	</div>
);

const FillBlanksQuiz = () => {
	// Quiz questions data
	const quizData = [
		{
			id: 1,
			sentence:
				"She wrapped herself in a ___ blanket and settled down with a good book.",
			answer: "cozy",
			hint: "Comfortable and warm",
		},
		{
			id: 2,
			sentence: "The sky was a beautiful ___ color during sunset.",
			answer: "pink",
			hint: "A soft, rosy color",
		},
		{
			id: 3,
			sentence: "The ___ fox jumped over the lazy dog.",
			answer: "quick",
			hint: "Fast and alert",
		},
		{
			id: 4,
			sentence: "She felt ___ after receiving the good news.",
			answer: "happy",
			hint: "Feeling joy",
		},
	];

	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
		Math.floor(Math.random() * quizData.length),
	);
	const currentQuestion = quizData[currentQuestionIndex];
	const letterOptions = generateRandomLetter(quizData[currentQuestionIndex].sentence, quizData[currentQuestionIndex].answer);

	const [chars, setChars] = useState(
		new Array(currentQuestion.answer.length).fill(""),
	);
	const [isCorrect, setIsCorrect] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const inputRefs = useRef([]);

	// Check if all boxes are filled
	const isAllFilled = chars.every((char) => char !== "");

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, chars.length);
	}, []);

	const handleCharChange = (index, value) => {
		// Only accept letters
		const letter = value.slice(-1).toLowerCase();
		if (/^[a-zA-Z]$/.test(letter) || letter === "") {
			const newChars = [...chars];
			newChars[index] = letter;
			setChars(newChars);

			// Move to next input if there's a letter and it's not the last box
			if (letter && index < chars.length - 1) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		// Handle backspace
		if (e.key === "Backspace") {
			if (!chars[index] && index > 0) {
				// If current box is empty, move to previous box
				inputRefs.current[index - 1].focus();
			} else {
				// Clear current box
				const newChars = [...chars];
				newChars[index] = "";
				setChars(newChars);
			}
			// Reset submission state when editing
			setIsSubmitted(false);
			setIsCorrect(false);
		}
		// Handle left arrow
		else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1].focus();
		}
		// Handle right arrow
		else if (e.key === "ArrowRight" && index < chars.length - 1) {
			inputRefs.current[index + 1].focus();
		}
	};

	const handleSubmit = () => {
		if (!isAllFilled) {
			return; // Don't submit if not all boxes are filled
		}
		const answer = chars.join("").toLowerCase();
		setIsCorrect(answer === currentQuestion.answer);
		setIsSubmitted(true);
	};

	const handleReset = () => {
		setChars(new Array(currentQuestion.answer.length).fill(""));
		setIsCorrect(false);
		setShowHint(false);
		setIsSubmitted(false);
		inputRefs.current[0]?.focus();
	};


	return (
		<div>
			<Card className="w-full">
				{/* Quiz Content */}
				<div className="p-6">
					<h2 className="text-lg font-medium mb-10">
						Complete the sentence with the correct word
					</h2>
					<div className="mb-6 text-gray-700 text-4xl">
						{currentQuestion.sentence.split("___")[0]}
						<div className="inline-flex gap-2">
							{chars.map((char, index) => (
								<input
									key={index}
									ref={(el) =>
										(inputRefs.current[index] = el)
									}
									type="text"
									value={char}
									onChange={(e) =>
										handleCharChange(index, e.target.value)
									}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className={`w-16 h-14 bg-transparent border-b-2 border-primary text-center text-4xl font-bold 
                           focus:border-blue-500 focus:outline-none
                           ${
										isSubmitted && isCorrect
											? "border-green-500 bg-green-50"
											: ""
									}
                           ${
										isSubmitted && !isCorrect
											? "border-red-500 bg-red-50"
											: ""
									}`}
									maxLength={1}
									disabled={isSubmitted}
								/>
							))}
						</div>
						{currentQuestion.sentence.split("___")[1]}
					</div>

					{/* Answer Status */}
					{isSubmitted && (
						<div
							className={`p-3 rounded-lg mb-4 ${
								isCorrect ? "bg-green-50" : "bg-red-50"
							}`}>
							<div className="flex items-center">
								{isCorrect ? (
									<span className="text-green-700">
										✓ Correct! The answer is "
										{currentQuestion.answer}"
									</span>
								) : (
									<span className="text-red-700">
										× Incorrect. Try again!
									</span>
								)}
								<button
									onClick={handleReset}
									className="ml-auto text-sm text-gray-600 hover:text-gray-800">
									Solve again
								</button>
							</div>
						</div>
					)}
				</div>
			</Card>
			<div className="mt-10 w-full flex gap-2 justify-center">
				{letterOptions?.map((letter, index) =>
					<Button key={index} className="bg-white text-2xl" variant="shadow" size="lg"
							isIconOnly>{letter}</Button>)}
			</div>
		</div>
	);
};

export default FillBlanksQuiz;
