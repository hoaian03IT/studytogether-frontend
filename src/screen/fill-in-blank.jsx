import React, { useState, useRef, useEffect } from "react";

const Card = ({ children, className }) => (
	<div className={`bg-white rounded-lg shadow-lg ${className}`}>
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

	const handleNextQuestion = () => {
		const nextIndex = (currentQuestionIndex + 1) % quizData.length;
		setCurrentQuestionIndex(nextIndex);
		setChars(new Array(quizData[nextIndex].answer.length).fill(""));
		setIsCorrect(false);
		setShowHint(false);
		setIsSubmitted(false);
	};

	return (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<Card className='w-full max-w-lg'>
				{/* Timer Header */}
				<div className='flex items-center p-4 border-b'>
					<div className='flex items-center space-x-2'>
						<span className='text-lg font-semibold'>00:00</span>
						<button className='p-1 rounded-full hover:bg-gray-100'>
							<svg
								className='w-4 h-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
								/>
							</svg>
						</button>
					</div>
					<span className='ml-auto text-gray-600'>
						Fill in the blanks #{currentQuestionIndex + 1}
					</span>
				</div>

				{/* Quiz Content */}
				<div className='p-6'>
					<h2 className='text-lg font-medium mb-4'>
						Complete the sentence with the correct word
					</h2>
					<div className='mb-6 text-gray-700'>
						{currentQuestion.sentence.split("___")[0]}
						<div className='inline-flex gap-2'>
							{chars.map((char, index) => (
								<input
									key={index}
									ref={(el) =>
										(inputRefs.current[index] = el)
									}
									type='text'
									value={char}
									onChange={(e) =>
										handleCharChange(index, e.target.value)
									}
									onKeyDown={(e) => handleKeyDown(index, e)}
									className={`w-10 h-10 border-2 rounded text-center text-lg font-medium 
                           focus:border-blue-500 focus:outline-none uppercase
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

					{/* Helper Buttons */}
					{!isSubmitted && (
						<div className='flex gap-2 mb-4'>
							<button
								onClick={() => setShowHint(true)}
								className='text-sm text-blue-600 hover:text-blue-700'>
								Show Hint
							</button>
						</div>
					)}

					{/* Hint */}
					{showHint && !isSubmitted && (
						<div className='mb-4 p-3 bg-blue-50 rounded-lg'>
							<p className='text-sm text-blue-700'>
								Hint: {currentQuestion.hint}
							</p>
						</div>
					)}

					{/* Answer Status */}
					{isSubmitted && (
						<div
							className={`p-3 rounded-lg mb-4 ${
								isCorrect ? "bg-green-50" : "bg-red-50"
							}`}>
							<div className='flex items-center'>
								{isCorrect ? (
									<span className='text-green-700'>
										✓ Correct! The answer is "
										{currentQuestion.answer}"
									</span>
								) : (
									<span className='text-red-700'>
										× Incorrect. Try again!
									</span>
								)}
								<button
									onClick={handleReset}
									className='ml-auto text-sm text-gray-600 hover:text-gray-800'>
									Solve again
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between p-4 border-t bg-gray-50'>
					<button className='px-4 py-2 text-gray-600 hover:bg-gray-200 rounded'>
						Exit
					</button>
					<div className='flex items-center space-x-4'>
						{isCorrect && (
							<button
								className='p-2 hover:bg-gray-200 rounded'
								onClick={handleNextQuestion}>
								Next →
							</button>
						)}
					</div>
					<button
						onClick={handleSubmit}
						disabled={!isAllFilled || isSubmitted}
						className={`px-4 py-2 rounded ${
							!isAllFilled || isSubmitted
								? "bg-gray-300 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700 text-white"
						}`}>
						Submit
					</button>
				</div>
			</Card>
		</div>
	);
};

export default FillBlanksQuiz;
