import { AiOutlineClose } from "react-icons/ai";
import { Button } from "@nextui-org/react";

import React, { useState } from "react";
const NotificationComponent = () => {
	const handleDelete = () => {};

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
		{
			icon: "💬",
			message: "Sarah Khan replied to your feedback",
			time: "01:55 PM 29 July, 2024",
		},
		{
			icon: "💬",
			message: "Sarah Khan replied to your feedback",
			time: "01:55 PM 29 July, 2024",
		},
	];

	return (
		<div className='bg-gray-100 flex items-center justify-center rounded-lg'>
			<div className='w-full max-w-md p-4 bg-white rounded-lg shadow-md'>
				<h2 className='text-xl font-semibold text-black mb-4'>
					Notifications
				</h2>
				<div className='h-96 space-y-4 overflow-y-auto'>
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
							<div className='ml-auto'>
								<Button
									className='bg-transparent'
									isIconOnly
									radius='full'
									size='sm'
									aria-label='Options'>
									<AiOutlineClose />
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export { NotificationComponent };
