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

	async fetchCourseComment(courseId) {
		const res = await http.get(`/course/comment?course-id=${courseId}`);
		return res.data;
	}

	async fetchCourseLanguages(courseId) {
		const res = await http.get(`/course/languages?course-id=${courseId}`);
		return res.data;
	}

	async addNewLevelCourse(courseId, levelName, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post(`/level/new`, { courseId: Number(courseId), levelName: Number(levelName) });
		return res.data;
	}

	async removeLevelCourse(courseId, levelId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.delete(`/level/delete?course-id=${courseId}&level-id=${levelId}`);
		return res.data;
	}

	async updateLevelNameCourse(courseId, levelId, levelName, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/level/edit", {
			courseId: Number(courseId),
			levelId: Number(levelId),
			levelName,
		});
		return res.data;
	}
}

const CourseService = new CourseServiceClass();

export { CourseService };
