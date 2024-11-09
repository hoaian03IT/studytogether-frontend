import { http } from "../config/http";

class CourseLevelServiceClass {
	async fetchCourseLevelByLanguage(languageId) {
		const res = await http.get(`/level-course/all?language-id=${languageId}`);
		return res.data;
	}
}

const CourseLevelService = new CourseLevelServiceClass();

export { CourseLevelService };
