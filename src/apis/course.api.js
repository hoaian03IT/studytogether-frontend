import { createHttpAuth, http } from "../config/http";

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

	async fetchCourseInformation(courseId) {
		const res = await http.get(`/course/overview?course-id=${courseId}`);
		return res.data;
	}

	async fetchCourseContent(courseId) {
		const res = await http.get(`/course/content?course-id=${courseId}`);
		return res.data;
	}
}

const CourseService = new CourseServiceClass();

export { CourseService };
