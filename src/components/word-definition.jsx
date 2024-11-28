import { Image } from "@nextui-org/image";
import React, { useEffect } from "react";
import { Audio } from "./audio.jsx";

const WordDefinition = ({ word, definition, type, transcript, image, audio, examples = [], handleCheckResult }) => {

	useEffect(() => {
		handleCheckResult(true);
	}, [word, definition, type, transcript, image, audio, examples]);

	return <div>
		<div className="flex-1 flex flex-col space-y-10">
		</div>
		<div className="flex justify-between items-start">
			<div className="space-y-8">
				<div>
					<p className="uppercase text-sm">word</p>
					<div className="flex items-center gap-4">
						<p className="ms-4 text-4xl">
							<strong>{word}</strong> {type ? `(${type})` : ""} {transcript ?
							<span className="font-custom-inter">- {transcript}</span> : ""}
						</p>
						<Audio src={audio} show={!!audio} />
					</div>
				</div>
				<div>
					<p className="uppercase text-sm">definition</p>
					<p className="ms-4 text-3xl">{definition}</p>
				</div>
			</div>
			<div>
				<Image className="max-h-60 max-w-60"
					   src={image} />
			</div>
		</div>
		{examples.length > 0 && <div className="space-y-2 text-sm mt-10">
			<p className="uppercase text-sm">example</p>
			{examples.map((item, index) =>
				<div key={index} className="flex items-start gap-2 text-gray-800 ms-4">
					<p>Ex {index + 1}:</p>
					<div>
						<p>{item?.["title"]}</p>
						<p className="font-semibold">{item?.["example sentence"]}</p>
						<p>Explain: {item?.["explanation"]}</p>
					</div>
				</div>,
			)}
		</div>}
	</div>;
};

export { WordDefinition };