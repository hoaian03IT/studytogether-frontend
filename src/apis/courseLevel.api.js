import { createHttpAuth, http } from "../config/http";

class CourseLevelServiceClass {
	async fetchCourseLevelByLanguage(languageId) {
		const res = await http.get(`/level-course/all?language-id=${languageId}`);
		return res.data;
	}

	async fetchCourseLevelByCourse(courseId, userState, updateUserState) {
		if (!courseId) return null;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/level/all/${courseId}`);
		return res.data;
	}
}

const CourseLevelService = new CourseLevelServiceClass();

export { CourseLevelService };
