import { div } from "framer-motion/client";
import React from "react";
import { AiOutlineEllipsis } from "react-icons/ai";
import { Button } from "@nextui-org/react";

const NotificationComponent = () => {
	const notifications = [
		{
			icon: "🔥",
			message: "Chuỗi học 1 tuần của bạn sắp kết thúc",
			time: "04:25 PM 31 October, 2024",
		},
		{
			icon: "👩‍🎓",
			message: "Jessica Liu đã đăng ký khóa",
			time: "08:49 PM 30 October, 2024",
		},
		{
			icon: "📘",
			message: "Bạn có 20 từ vựng cần ôn tập ngay",
			time: "10:30 AM 30 October, 2024",
		},
		{
			icon: "💬",
			message: "Sarah Khan replied to your feedback",
			time: "01:55 PM 29 July, 2024",
		},
	];

	return (
		<div className='bg-gray-100 min-h-screen flex items-center justify-center'>
			<div className='w-full max-w-md p-4 bg-white rounded-lg shadow-md'>
				<h2 className='text-xl font-semibold text-gray-700 mb-4'>
					Notifications
				</h2>
				<div className='space-y-4'>
					{notifications.map((notification, index) => (
						<div
							key={index}
							className='flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow'>
							<div className='flex items-center justify-center w-10 h-10 text-xl bg-gray-200 rounded-full'>
								{notification.icon}
							</div>
							<div className='ml-3'>
								<p className='text-sm font-medium text-gray-800'>
									{notification.message}
								</p>
								<p className='text-xs text-gray-500'>
									{notification.time}
								</p>
							</div>
							<Button className='ml-auto max-w-5 text-gray-400 hover:text-gray-600 size-10 rounded-full'>
								<AiOutlineEllipsis />
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default NotificationComponent;
