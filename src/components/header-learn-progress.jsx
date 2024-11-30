import { FaRegLightbulb } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";
import { RiCloseLine } from "react-icons/ri";
import { IoGitCompareOutline, IoSpeedometerOutline } from "react-icons/io5";
import React, { memo } from "react";
import clsx from "clsx";

const HeaderLearnProgress = memo(function({ page = "learn", title }) {
	return <div
		className={clsx(page === "speed-review" ? "bg-danger" : page === "classic-review" ? "bg-third" : "bg-primary")}>
		<div className="text-2xl font-bold container py-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{page === "speed-review" ? <IoSpeedometerOutline
						className="size-8 text-white" /> : page === "classic-review" ?
						<IoGitCompareOutline className="size-8 text-white" /> :
						<FaRegLightbulb className="size-8 text-white" />}

					<span className="text-white underline underline-offset-4">{title}</span>
				</div>
				<div>
					<Tooltip content="Exit current session" className="bg-gray-800 text-white"
							 placement="bottom"
							 offset={2}
							 radius="none"
							 closeDelay={100}>
						<button onClick={() => navigate("/course-participant")}>
							<RiCloseLine className="size-12 opacity-40" />
						</button>
					</Tooltip>
				</div>
			</div>
		</div>
		<div>
		</div>
	</div>;
});

export { HeaderLearnProgress };