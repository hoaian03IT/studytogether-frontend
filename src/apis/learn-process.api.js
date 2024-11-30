import { createHttpAuth } from "../config/http.js";

class LearnProcessServiceClass {
	async fetchLearnNewWordSession(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/learn/new-words?ci=${courseId}`);
		return res.data;
	}

	async updateLearnNewWordSession(payload, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const { courseId, words, points } = payload; // words = [{wordId: number, wrongTimes: number, repeatable: boolean}]
		const res = await httpAuth.post("/learn/update-new-words", { courseId, words, points });
		return res.data;
	}

	async fetchSpeedReviewSession(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/learn/speed-review?ci=${courseId}`);
		return res.data;
	}

	async updateLearnProgress(payload, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const { courseId, words, points } = payload;
		const res = await httpAuth.post(`/learn/update-progress`, { courseId, words, points });
		return res.data;
	}
}

const LearnProcessService = new LearnProcessServiceClass();

export { LearnProcessService };