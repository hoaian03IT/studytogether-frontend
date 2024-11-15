import { createHttpAuth, http } from "../config/http";

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

	async checkUsernameExists(username) {
		const res = await http.get(`/user/exists-username?username=${username}`);
		return res;
	}

	async updateUserInfo(payload, userState, updateUserState) {
		const { firstName, lastName, phone, username, avatarBase64 } = payload;
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.post("/user/update-info", { firstName, lastName, phone, username, avatarBase64 });
		return res.data;
	}
}

const UserService = new UserServiceClass();

export { UserService };
