import { createHttpAuth } from "../config/http";

class UserServiceClass {
	async fetchUserInfo(userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get("/user/me");
		return res.data;
	}

	async fetchEnrollmentInfo(courseId, userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get(`/enrollment/enrollment-information?course-id=${courseId}`);
		return res.data;
	}
}

const UserService = new UserServiceClass();

export { UserService };
