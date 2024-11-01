import { createHttpAuth } from "../config/http.js";

class VocabularyServiceClass {
	async fetchVocabulary(courseId, userState, updateUserState) {
		const httpAuth = await createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/vocabulary/all/${courseId}`);
		return res.data;
	}
}

const VocabularyService = new VocabularyServiceClass();
export { VocabularyService };