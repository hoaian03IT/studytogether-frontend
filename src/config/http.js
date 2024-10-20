import axios from "axios";

class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_SERVER_URL,
            timeout: 10000,
            headers: { "Content-Type": "application/json" },
        });
    }
}

const http = new Http().instance;

export { http };
