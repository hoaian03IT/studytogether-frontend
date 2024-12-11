import axios from "axios";

const xaiApiKey = import.meta.env.VITE_GROK_AI_KEY;

const data = {
	messages: [
		{
			role: "system",
			content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy.",
		},
		{
			role: "user",
			content: `You only answer by json and there is no new line, just pure json. JSON format is {"source language": "_my_provide_","target language": "_my_provide_","word": "_my_provide_with_target_language_","translation": "_your_generation_with_source_language_","examples": [{"example": "_your_generation_with_target_language_", "explanation": "_your_generation_with_source_language_"}], // 2-3 examples
                "transcript" ["_your_generation_"], // how to pronounce the word by target language,
            }.
                Now do your work, my input: {
                "source language": "Vietnamese",
                "target language": "English",
                "word": "a car"
                }.`,
		},
	],
	model: "grok",
	stream: false,
	temperature: 0,
};

class GrokAIService {
	static async getRelatedInformationWord(sourceLanguage, targetLanguage, word) {
		const data = {
			messages: [
				{
					role: "system",
					content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy.",
				},
				{
					role: "user",
					content: `You only answer by json and there is no new line, just pure json. JSON format is {"source language": "_my_provide_","target language": "_my_provide_","word": "_my_provide_with_target_language_","translation": ["_your_generation_with_source_language_"], "type word": ["_your_generation_with_target_language_"], // 4-5 translation an type word if has
                            "transcript" ["_your_generation_"], // how to pronounce the word by target language with standard phonetic transcription and 4-5 transcripts,
                            }.
                            Now do your work, my input: {
                            "source language": "${sourceLanguage}",
                            "target language": "${targetLanguage}}",
                            "word": "${word}"
                            }.`,
				},
			],
			model: "grok-beta",
			stream: false,
			temperature: 0,
		};

		const response = await axios.post(`https://api.x.ai/v1/chat/completions`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${xaiApiKey}`,
			},
		});
		return JSON.parse(response?.data?.choices[0]?.message?.content);
	}
}

export { GrokAIService };
