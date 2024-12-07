import { useRef } from "react";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/react";

export const ImageAndAudio = ({
								  imageSrc,
								  audioSrc,
								  handleSelectImage,
								  handleSelectAudio,
								  typeExercise,
								  handleRemoveMedia,// (type) => void
							  }) => {
	const imageFileRef = useRef(null);
	const audioFileRef = useRef(null);

	const handleOpenImageFile = () => {
		imageFileRef.current.click();
	};

	const handleOpenAudioFile = () => {
		audioFileRef.current.click();
	};

	const handlePlayAudio = () => {
		audioFileRef.current.play();
	};

	return <div className="flex items-center gap-8 overflow-x-hidden">
		<div className="w-1/2">
			<label>Image:</label>
			<Image src={imageSrc || "https://cdn-icons-png.flaticon.com/512/8136/8136031.png"}
				   alt="image"
				   className="size-32 border-1 border-gray-200 cursor-pointer" radius="sm"
				   onClick={handleOpenImageFile} />
			<div className="flex items-center">
				<input name="image" aria-label={typeExercise} ref={imageFileRef} type="file" accept=".jpg, .png"
					   className="w-full" onChange={handleSelectImage} />
				<Button type="button" isIconOnly={true} size="sm" variant="light"
						onClick={() => handleRemoveMedia("image")}>❌</Button>
			</div>
		</div>
		<div className="w-1/2">
			<label>Audio:</label>
			{audioSrc ? <div>
					<button type="button" className="text-4xl size-32" onClick={handlePlayAudio}>🔊</button>
				</div> :
				<div className="size-32 italic font-light">(Empty)</div>}
			<audio ref={audioFileRef} src={audioSrc} />
			<div className="flex items-center">
				<input name="audio" aria-label={typeExercise} type="file" accept=".mp3"
					   className="w-full" onChange={handleSelectAudio} />
				<Button type="button" isIconOnly={true} size="sm" variant="light"
						onClick={() => handleRemoveMedia("audio")}>❌</Button>
			</div>
		</div>
	</div>
		;
};
