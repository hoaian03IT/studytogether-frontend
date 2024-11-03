import { createHttpAuth } from "../config/http.js";

class ExampleServiceClass {
	async fetchExamples({ courseId, wordId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/example/all?course-id=${courseId}&word-id=${wordId}`);
		return res.data;
	}

	async addNewExample({ courseId, wordId, title, example, explanation }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/example/new", {
			courseId, wordId, title, sentence: example, explanation,
		});
		return res.data;
	}

	async updateExample({ courseId, wordId, exampleId, title, example, explanation }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/example/edit", {
			courseId,
			wordId,
			title,
			exampleId,
			sentence: example,
			explanation,
		});
		return res.data;
	}

	async deleteExample({ courseId, wordId, exampleId }, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.delete(`/example/delete?course-id=${courseId}&word-id=${wordId}&example-id=${exampleId}`);
		return res.data;
	}
}

const ExampleService = new ExampleServiceClass();
export { ExampleService };