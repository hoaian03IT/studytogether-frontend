import React, { useContext, useState } from "react";
import { FaRegLightbulb } from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";
import { Button, Progress, Tooltip } from "@nextui-org/react";
import { IoIosArrowForward } from "react-icons/io";
import { AiFillThunderbolt } from "react-icons/ai";
import clsx from "clsx";
import { WordDefinition } from "../components/word-definition.jsx";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil/atoms/user.atom.js";
import { GlobalStateContext } from "../components/providers/GlobalStateProvider.jsx";
import { useLocation } from "react-router-dom";
import { LearnProcessService } from "../apis/learn-process.api.js";

function LearnPage() {
	const user = useRecoilValue(userState);
	const { search } = useLocation();
	const queries = new URLSearchParams(search);

	const { updateUserState } = useContext(GlobalStateContext);

	const [markDown, setMarkDown] = useState(false);
	const [currentPoints, setCurrentPoints] = useState(0);

	const learnNewWordSessionQuery = useQuery({
		queryKey: [user.info?.username, queries.get("ci")],
		queryFn: async () => {
			const data = await LearnProcessService.fetchLearnNewWordSession(queries.get("ci"), userState, updateUserState);
			console.log(data);
		},
		enabled: !user.info?.username,
	});

	const handleToggleMarkDown = () => {
		setMarkDown(!markDown);
	};
	return (
		<div className="flex flex-col h-screen">
			<div className="bg-primary">
				<div className="text-2xl font-bold underline container py-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FaRegLightbulb className="size-8 text-white" />
							<span>English - New level</span>
						</div>
						<div>
							<Tooltip content="Exit current session" className="bg-gray-800 text-white"
									 placement="bottom"
									 offset={2}
									 radius="none"
									 closeDelay={100}>
								<button>
									<RiCloseLine className="size-12 opacity-40" />
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-200 flex-1">
				<div className="container">
					<div className="py-10">
						<div className="flex justify-between items-start gap-8">
							<div className="flex-1">
								<Progress size="lg" color="success" value="50" radius="none" />
								<div>
									<WordDefinition />
								</div>
							</div>
							<div className="-translate-y-1">
								<input aria-label="point"
									   aria-labelledby="point"
									   className="w-20 h-5 rounded-sm text-center text-[10px] pointer-events-none"
									   type="text" value={currentPoints} onChange={() => {
								}} />
								<Button className="flex flex-col max-h-none h-max w-20 py-4 px-2 mt-10" radius="sm"
										color="secondary"
										variant="shadow">
									<IoIosArrowForward className="size-12" />
									<span className="font-semibold text-xl">Next</span>
								</Button>
								<Tooltip content="Marked word will appear much in practice"
										 className="bg-gray-800 text-white text-[10px] w-40 text-center"
										 placement="bottom"
										 offset={2}
										 radius="none"
										 closeDelay={100}>
									<button className="mt-5" onClick={handleToggleMarkDown}>
										<AiFillThunderbolt
											className={clsx("size-6 transition-all", markDown ? "text-gray-400" : "text-warning")} />
									</button>
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LearnPage;