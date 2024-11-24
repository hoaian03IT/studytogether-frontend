import { PiSpeakerSimpleHighBold } from "react-icons/pi";
import { useEffect, useRef } from "react";
import clsx from "clsx";

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
		{show && <button type="button" onClick={handlePlay}>
			<Icon
				className={clsx("size-8 text-secondary active:opacity-50 transition-all", size === "sm" ? "size-4" : size === "md" ? "size-5" ? size === "lg" : "size-8" : "")} />
		</button>}
	</div>;
}

export { Audio };