import { createHttpAuth } from "../config/http.js";

class ExerciseServiceClass {
	async addNewExercise(payload, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const {
			courseId, levelId, exerciseType, difficultyLevel, questionText, answerText, image, audio,
			splitChar, explanation, options, title,
		} = payload;
		const res = await httpAuth.post(`/exercise/new`, {
			courseId, levelId, exerciseType, difficultyLevel, questionText, answerText, image, audio,
			splitChar, explanation, options, title,
		});
		return res.data;
	}

	async getExerciseByCourse({ courseId, levelId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/exercise?course-id=${courseId}${levelId ? `&level-id=${levelId}` : ""}`);
		return res.data;
	}

	async updateExercise(payload, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const {
			courseId, levelId, exerciseId, difficultyLevel, questionText, answerText,
			image, audio, splitChar, explanation, options, title,
		} = payload;
		const res = await httpAuth.post("/exercise/edit", {
			courseId, levelId, exerciseId, difficultyLevel, questionText, answerText,
			image, audio, splitChar, explanation, options, title,
		});
		return res.data;
	}

	async deleteExercise({ exerciseId, courseId, levelId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.delete(`/exercise/delete?course-id=${courseId}&level-id=${levelId}&exercise-id=	${exerciseId}`);
		return res.data;
	}
}

const ExerciseService = new ExerciseServiceClass();

export { ExerciseService };