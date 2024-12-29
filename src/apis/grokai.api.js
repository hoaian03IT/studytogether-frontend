import axios from "axios";

const xaiApiKey = import.meta.env.VITE_GROK_AI_KEY;

const data = {
	messages: [
		{
			role: "system",
			content:
				"You are a helpful education assistance. You provide clear, concise and various information to help learners/teachers understand vocabulary and examples",
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
	static async getRelatedInformationWord({ sourceLanguage, targetLanguage, word }) {
		const data = {
			messages: [
				{
					role: "system",
					content:
						"You are a helpful education assistance. You provide clear, concise and various information to help learners/teachers understand vocabulary and examples",
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

	static async getExampleByWord({ sourceLanguage, targetLanguage, word, definition, typeWord }) {
		const data = {
			messages: [
				{
					role: "system",
					content:
						"You are a helpful education assistance. You provide clear, concise and various information to help learners/teachers understand vocabulary and examples",
				},
				{
					role: "user",
					content: `You must respond only with JSON in a single-line format. The JSON must include examples for a given word in various scenarios. You must provide 3-4 examples. 

					Format:
					[{
					"source language": "Tiếng việt",
					"target language": "English",
					"word": "<provided word in target language>",
					"definition": "<provided definition in source language>",
					"type word": "<provided type word in target language>",
					"title example": "<your generated title in target language>",
					"example sentence": "<your generated example sentence in target language>",
					"explanation": "<your generated explanation in source language>"
					}]

					Rules:
					1. "title example" and "example sentence" must be generated in the target language.
					2. "explanation" must be generated in the source language.
					3. Ensure the JSON is syntactically correct and appears as a single line without line breaks.

					Input:
					{
					"source language": "Tiếng việt",
					"target language": "English",
					"word": "${word}",
					"definition": "${definition}",
					"type word": "${typeWord}"
					}

					Now, remember the language rules I provide then create and return the JSON based on the input.`,
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
		const listExamples = JSON.parse(response?.data?.choices[0]?.message?.content);
		return listExamples[Math.floor(Math.random() * listExamples.length)];
	}
}

export { GrokAIService };
