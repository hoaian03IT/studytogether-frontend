import { createHttpAuth } from "../config/http";

class CourseServiceClass {
	async createCourse(userState, updateUserState, payload) {
		const {
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
		} = payload;

		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/course/create`, {
			courseName,
			sourceLanguageId,
			courseLevelId,
			tag,
			shortDescription,
			detailedDescription,
			image,
		});
		return res.data;
	}
}

const CourseService = new CourseServiceClass();

export { CourseService };