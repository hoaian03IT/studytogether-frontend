import { createHttpAuth } from "../config/http.js";

class VocabularyServiceClass {
	async fetchVocabulary(courseId, userState, updateUserState) {
		const httpAuth = await createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/vocabulary/all/${courseId}`);
		return res.data;
	}

	async addNewVocabulary(payload, userState, updateUserState) {
		const { courseId, levelId, word, definition, image, pronunciation, type } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/vocabulary/new", {
			courseId: Number(courseId),
			levelId: Number(levelId),
			word,
			definition,
			image,
			pronunciation,
			type,
		});
		return res.data;
	}

	async removeVocabulary(payload, userState, updateUserState) {
		const { courseId, levelId, wordId } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.delete(`/vocabulary/delete?course-id=${Number(courseId)}&level-id=${Number(levelId)}&word-id=${Number(wordId)}`);
		return res.data;
	}

	async updateVocabulary(payload, userState, updateUserState) {
		const { courseId, levelId, wordId, word, definition, image, pronunciation, type } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/vocabulary/edit`, {
			courseId: Number(courseId),
			levelId: Number(levelId),
			wordId: Number(wordId),
			word,
			definition,
			image,
			pronunciation,
			type,
		});
		return res.data;
	}
}

const VocabularyService = new VocabularyServiceClass();
export { VocabularyService };