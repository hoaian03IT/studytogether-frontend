import { http } from "../config/http";

export const ChatGPTService = {
  suggestExample: async (word) => {
    if (!word) throw new Error("Word is required for generating examples.");
    const res = await http.post("/chatgpt/generate-example", { word });
    return res.data;
  },

  suggestExplanation: async (sentence) => {
    if (!sentence) throw new Error("Sentence is required for generating explanations.");
    const res = await http.post("/chatgpt/generate-explanation", { sentence });
    return res.data;
  },
};

