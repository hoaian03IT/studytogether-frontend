import { createHttpAuth } from "../config/http.js";

class LearnProcessServiceClass {
	async fetchLearnNewWordSession(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/learn/new-words?ci=${courseId}`);
		return res.data;
	}
}

const LearnProcessService = new LearnProcessServiceClass();

export { LearnProcessService };