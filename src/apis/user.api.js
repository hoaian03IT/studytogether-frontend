import { createHttpAuth } from "../config/http";

class UserServiceClass {
	async fetchUserInfo(userState, updateUserState) {
		const httpAuth = createHttpAuth(userState, updateUserState);
		const res = await httpAuth.get("/user/me");
		return res.data;
	}
}

const UserService = new UserServiceClass();

export { UserService };
