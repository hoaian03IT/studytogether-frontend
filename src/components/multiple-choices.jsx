import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import { FaRegSadCry, FaRegThumbsUp } from "react-icons/fa";
import clsx from "clsx";
import { Audio } from "./audio.jsx";

function generateOptions(options = [], answer, number) {
	let tmpArray = options.slice(0);
	if (number > options.length) {
		return null;
	}
	let newArray = [];
	for (let i = 0; i < number; i++) {
		let randomIndex = Math.floor(Math.random() * tmpArray.length);
		newArray.push(tmpArray[randomIndex]);
		tmpArray.splice(randomIndex, 1);
	}

	let randomAnswerIndex = Math.floor(Math.random() * tmpArray.length);
	newArray = newArray
		.slice(0, randomAnswerIndex)
		.concat([answer])
		.concat(newArray.slice(randomAnswerIndex));
	return newArray;
}


const MultipleChoiceExercise = (
	{
		isCorrect,
		question,
		answer,
		options,
		image,
		pronunciation,
		handleCheckResult,
		rd,
	}) => {
	const [selectedAnswer, setSelectedAnswer] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [optionsForUser, setOptionForUser] = useState([]);

	useEffect(() => {
		setSelectedAnswer("");
		setIsSubmitted(false);
		let results = generateOptions(options, answer, 3) || [];
		setOptionForUser(results);
	}, [rd, question, answer, options, image, pronunciation]);

	const handleSubmit = (userAnswer) => {
		if (isSubmitted) return;
		setSelectedAnswer(userAnswer);
		setIsSubmitted(true);
		handleCheckResult(userAnswer === answer);
	};


	return (
		<div className="flex flex-col items-center overflow-hidden">
			<h2 className="text-4xl font-bold mb-6 flex flex-col items-center gap-2 break-words">{question} {pronunciation &&
				<Audio src={pronunciation} show={!!pronunciation} />}
			</h2>

			<div className="space-y-4 w-full flex flex-col items-center">
				<div>
					<Image className="min-h-64 min-w-64" src={image} alt={question} />
				</div>
				<p className="text-2xl font-bold mb-6 flex items-center gap-2">Answer:</p>
				<div className="w-full grid grid-cols-2 gap-4">
					{optionsForUser?.map((item, index) =>
						<Button
							className={clsx("col-span-1 h-16 text-black text-xl", isSubmitted ? "pointer-events-none" : "pointer-events-auto")}
							key={index}
							variant={isSubmitted && selectedAnswer ? "shadow" : "bordered"}
							color={isSubmitted && isCorrect && item === answer ? "success" : isSubmitted && !isCorrect && item === answer ? "success" : isSubmitted && !isCorrect && selectedAnswer === item ? "danger" : "default"}
							onClick={() => handleSubmit(item)}
							size="lg">{item}</Button>)
					}
				</div>
			</div>

			{isSubmitted && (
				<div className="mt-4 text-lg font-semibold w-full">
					{isCorrect ?
						<div
							className="w-full h-20 bg-success-200 text-success-600 text-4xl flex items-center justify-center gap-2 rounded-medium">
							<FaRegThumbsUp className="size-10" /> Great job!</div> : <div
							className="w-full h-20 bg-danger-100 text-danger-600 text-4xl flex items-center justify-center gap-2 rounded-medium">
							<FaRegSadCry className="size-10" /> Don't give up. Try again!</div>}
				</div>
			)}
		</div>
	);
};

export { MultipleChoiceExercise };
