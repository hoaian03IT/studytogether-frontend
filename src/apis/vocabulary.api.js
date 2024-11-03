import { createHttpAuth } from "../config/http.js";

class VocabularyServiceClass {
	async fetchVocabulary(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		let vocabularyList = [];
		try {
			const res = await httpAuth.get(`/vocabulary/all/${courseId}`);
			const { data } = res;
			if (data?.vocabularyList?.length === 0)
				return vocabularyList;
			let records = data?.vocabularyList;
			let count = 0, currentLevelId = records[0]?.["level id"];
			vocabularyList.push({
				levelId: records[0]?.["level id"],
				levelName: records[0]?.["level name"],
				words: [],
			});
			for (let record of records) {
				if (currentLevelId !== record?.["level id"]) {
					currentLevelId = record?.["level id"];
					vocabularyList.push({
						levelId: record?.["level id"],
						levelName: record?.["level name"],
						words: [],
					});
					count++;
				}
				if (record?.["word id"]) {
					vocabularyList[count].words.push({
						wordId: record?.["word id"],
						word: record?.["word"],
						definition: record?.["definition"],
						image: record?.["image"],
						pronunciation: record?.["pronunciation"],
						type: record?.["type"],
					});
				}
			}
		} catch (error) {
			console.error(error);
		}
		return vocabularyList;
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