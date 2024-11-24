import { PiSpeakerSimpleHighBold } from "react-icons/pi";
import { useEffect, useRef } from "react";

function Audio({ src, Icon = PiSpeakerSimpleHighBold, show = true, rd = 0 }) {
	const audioRef = useRef(null);

	const handlePlay = () => {
		audioRef.current.play()
			.finally(() => {
			});
	};

	useEffect(() => {
		if (audioRef.current) {
			handlePlay();
		}
	}, [audioRef.current, rd]);

	return <div>
		<audio autoPlay ref={audioRef} src={src} className="hidden">
			<source src={src} type="audio/mp3" />
		</audio>
		{show && <button type="button" onClick={handlePlay}>
			<Icon className="size-8 text-secondary active:opacity-50 transition-all" />
		</button>}
	</div>;
}

export { Audio };