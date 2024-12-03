import { AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";

import React, { useContext } from "react";
import { SocketClientContext } from "../providers/socket-client-provider.jsx";
import { Link } from "react-router-dom";

const NotificationComponent = () => {
	const { notifications } = useContext(SocketClientContext);

	return (
		<div className="bg-gray-100 flex items-center justify-center rounded-lg">
			<div className="w-full max-w-md min-w-64 p-4 bg-white rounded-lg shadow-md">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold text-black">
						Notifications
					</h2>
					<Link to="/notifications">View all</Link>

				</div>
				<div className="max-h-96 min-h-28 space-y-4 overflow-y-auto">
					{notifications?.length > 0 ? notifications.map((notification, index) => {
						let date = new Date(notification?.["created at"]);
						date = `${new Intl.DateTimeFormat(navigator.language, {
							hour: "2-digit",
							minute: "2-digit",
						}).format(date)} - ${date.toDateString()}`;
						return (
							<div
								key={index}
								className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
								<div
									className="flex items-center justify-center w-10 h-10 text-xl bg-gray-200 rounded-full">
									{notification?.type === "course-registration" ? "📖" : "🖥️"}
								</div>
								<div className="ml-3">
									<p className="text-sm font-medium text-gray-800">
										{`${notification?.factor} ${notification?.message} ${notification?.target}`}
									</p>
									<p className="text-xs text-gray-500">
										{date}
									</p>
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
					}) : <div className="flex items-center justify-center text-gray-500 font-light">You dont have any
						notifications</div>}
				</div>
			</div>
		</div>
	);
};
export { NotificationComponent };
