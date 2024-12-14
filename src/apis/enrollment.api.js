import { createHttpAuth } from "../config/http.js";

class EnrollmentServiceClass {
	async fetchEnrollmentInfo(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		return await httpAuth.get(`/enrollment/enrollment-information?course-id=${courseId}`);
	}

	async createEnrollment(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		return await httpAuth.post("/enrollment/create-enrollment", { courseId });
	}

	async restartEnrollment(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/enrollment/restart", { courseId });
		return res.data;
	}

	async quitEnrollment(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/enrollment/quit", { courseId });
		return res.data;
	}
}

const EnrollmentService = new EnrollmentServiceClass();

export { EnrollmentService };
