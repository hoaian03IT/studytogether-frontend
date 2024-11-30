import { Progress } from "@nextui-org/react";
import React from "react";

function ProgressBarPoint({ progressValue, progressMax, progressMin = 0, points, color = "success" }) {
	return <div className="grid grid-cols-12 gap-4">
		<div className="sm:col-span-10 lg:col-span-11">
			<Progress aria-label="LoadingThreeDot..." size="lg" color={color}
					  value={progressValue}
					  minValue={progressMin}
					  maxValue={progressMax} radius="none" />
		</div>
		<div className="sm:col-span-2 lg:col-span-1 bg-white h-5 text-sm text-center font-semibold">
			{points}
		</div>
	</div>;
}

export { ProgressBarPoint };