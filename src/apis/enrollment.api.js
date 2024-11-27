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
}

const EnrollmentService = new EnrollmentServiceClass();

export { EnrollmentService };