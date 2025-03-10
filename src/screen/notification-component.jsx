import { AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";

import React, { useContext } from "react";
import { SocketClientContext } from "../providers/socket-client-provider.jsx";
import { Link } from "react-router-dom";
import { TranslationContext } from "../providers/TranslationProvider.jsx";
import { convertUTCToLocalTime } from "../utils/convert-utc-to-local-time.js";

const NotificationComponent = () => {
	const { translation } = useContext(TranslationContext);
	const { notifications } = useContext(SocketClientContext);

	return (
		<div className="bg-gray-100 flex items-center justify-center rounded-lg">
			<div className="w-full max-w-md min-w-64 p-4 bg-white rounded-lg shadow-md">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-black">Recent notifications</h2>
				</div>
				<div className="max-h-96 min-h-28 space-y-4 overflow-y-auto">
					{notifications?.length > 0 ? (
						notifications.map((notification, index) => {
							let date = convertUTCToLocalTime(notification?.["created at"]);

							return (
								<div
									key={index}
									className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
									<div className="flex items-center justify-center w-10 h-10 text-xl bg-gray-200 rounded-full">
										{notification?.type === "course" ? "📖" : "🖥️"}
									</div>
									<div className="ml-3">
										<p className="text-sm font-medium text-gray-800">
											{`${notification?.factor} ${translation(notification?.message)} ${
												notification?.target
											}`}
										</p>
										<p className="text-xs text-gray-500">{date.toLocaleString()}</p>
									</div>
									<div className="ml-auto">
										<Button
											className="bg-transparent"
											isIconOnly
											radius="full"
											size="sm"
											aria-label="Options">
											<AiOutlineClose />
										</Button>
									</div>
								</div>
							);
						})
					) : (
						<div className="flex items-center justify-center text-gray-500 font-light">
							You dont have any notifications
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export { NotificationComponent };
