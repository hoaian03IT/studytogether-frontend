import { http } from "../config/http";

class LanguageServiceClass {
	async fetchAllLanguages() {
		const res = await http.get("/language/all");
		return res.data;
	}
}

const LanguageService = new LanguageServiceClass();

export { LanguageService };
