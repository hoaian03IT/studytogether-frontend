import { useEffect, useState } from "react";
import { GrokAIService } from "../apis/grokai.api";

export const useGenerateWordInformation = ({ sourceLanguage, targetLanguage, word }) => {
	const [response, setResponse] = useState({ translation: [], type: [], transcript: [] });
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (sourceLanguage && targetLanguage && word) {
			setLoading(true);
			GrokAIService.getRelatedInformationWord(sourceLanguage, targetLanguage, word)
				.then((data) => {
					console.log(data);
					setResponse({
						translation: data?.translation || [],
						type: data?.["type word"] || [],
						transcript: data?.transcript || [],
					});
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			setResponse({
				translation: [],
				type: [],
				transcript: [],
			});
		}
	}, [sourceLanguage, targetLanguage, word]);
	return { ...response, loading };
};
