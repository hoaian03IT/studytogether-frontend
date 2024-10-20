import { http } from "../config/http";

export const fetchAllRoles = async () => {
    const res = await http.get("/roles/all");
    return res;
};
