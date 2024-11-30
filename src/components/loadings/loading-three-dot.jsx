import React from "react";

export const LoadingThreeDot = () => {
	return <div className="h-screen flex items-center justify-center w-screen">
		<div className="w-full gap-x-2 flex justify-center items-center">
			{Array.from(new Array(3)).map((undefined, index) =>
				<div key={index} className="bg-black size-5 rounded-full animate-bounce" style={{
					animationDelay: `${index * 0.1}s`,
					animationDuration: "1s",
					display: "inline-block",
				}}></div>)}
		</div>
	</div>;
};
