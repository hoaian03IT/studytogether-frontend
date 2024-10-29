import { http } from "../config/http";

class AuthServiceClass {
	async createUserAccount({ email, password, role }) {
		const res = await http.post("/auth/register", { email, password, role }, { withCredentials: true });
		return res;
	}

	async loginUserAccount({ usernameOrEmail, password }) {
		const res = await http.post("/auth/login", { usernameOrEmail, password }, { withCredentials: true });
		return res;
	}

	async googleLogin({ token, role }) {
		const res = await http.post("/auth/login/google", { token: token, role }, { withCredentials: true });
		return res;
	}

	async facebookLogin({ token, role }) {
		const res = await http.post("/auth/login/facebook", { token: token, role }, { withCredentials: true });
		return res;
	}

	async refreshToken() {
		const res = await http.get("/auth/refresh-token", {
			withCredentials: true,
		});
		return res.data;
	}

	async forgotPassword(email) {
		const res = await http.post("/auth/forgot-password", { email: email });
		return res.data;
	}
}

const AuthService = new AuthServiceClass();

export { AuthService };
