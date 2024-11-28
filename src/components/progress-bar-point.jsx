import { Progress } from "@nextui-org/react";
import React from "react";

function ProgressBarPoint({ progressValue, progressMax, progressMin = 0, points }) {
	return <div className="grid grid-cols-12 gap-4">
		<Progress className="lg:col-span-11 sm:lg:col-span-10" aria-label="Loading..." size="lg" color="success"
				  value={progressValue}
				  minValue={progressMin}
				  maxValue={progressMax} radius="none" />
		<div className="lg:col-span-1 sm:lg:col-span-2">
			<input aria-label="point"
				   aria-labelledby="point"
				   className="w-20 h-5 -translate-y-1 rounded-sm text-center text-[10px] pointer-events-none"
				   type="text" value={points} onChange={() => {
			}} />
		</div>
	</div>;
}

export { ProgressBarPoint };