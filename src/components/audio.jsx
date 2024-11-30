import { PiSpeakerSimpleHighBold } from "react-icons/pi";
import { useEffect, useRef } from "react";

function Audio({ src, Icon = PiSpeakerSimpleHighBold, show = true, autoPlay = true, size, rd = 0 }) {
	const audioRef = useRef(null);

	const handlePlay = () => {
		audioRef.current.play()
			.finally(() => {
			});
	};

	useEffect(() => {
		if (autoPlay && audioRef.current) {
			handlePlay();
		}
	}, [audioRef.current, rd]);

	return <div>
		<audio autoPlay={autoPlay} ref={audioRef} src={src} className="hidden">
			<source src={src} type="audio/mp3" />
		</audio>
		{show && <button type="button" onClick={handlePlay} className="text-5xl">🔊</button>}
	</div>;
}

export { Audio };