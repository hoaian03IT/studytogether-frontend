import { randomMinMax } from "./randomMinMax.js";

export const generateRandomLetter = (question, answer) => {
	let answerLetters = answer.split("");
	let questionLetters = question.replaceAll("_", "").replaceAll(" ", "").split("");
	questionLetters = questionLetters.length > 0 ? questionLetters : answerLetters;
	let letters = [];
	let nRandomLetter = 3;
	for (let i = 0; i < nRandomLetter; i++) {
		letters.push(questionLetters[randomMinMax(0, questionLetters.length - 1)]);
	}

	while (answerLetters.length > 0) {
		let [letter] = answerLetters.splice(randomMinMax(0, answerLetters.length - 1), 1);
		letters.push(letter);
	}
	return letters;
};
