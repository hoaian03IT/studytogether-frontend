import { http } from "../config/http";

class UserServiceClass {
    async fetchUserInfo() {
        const res = await http.get("/user/me");
        return res;
    }
}
const UserService = new UserServiceClass();

export { UserService };
