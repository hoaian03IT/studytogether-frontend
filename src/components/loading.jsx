import React from "react";

export const Loading = () => {
	return <div className="w-full  gap-x-2 flex justify-center items-center">
		<div
			className="w-5 bg-[#B9E5E8] animate-pulse h-5 rounded-full animate-bounce"
		></div>
		<div
			className="w-5 animate-pulse h-5 bg-[#7AB2D3] rounded-full animate-bounce"
		></div>
		<div
			className="w-5 h-5 animate-pulse bg-[#4A628A] rounded-full animate-bounce"
		></div>
	</div>;
};
