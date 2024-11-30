export const LoadingWaitAMinute = () => {
	const letters = "Wait  a  minute".split("");

	return (
		<div className="h-screen w-screen flex items-center justify-center text-center">
			<div className="flex justify-center items-center space-x-1">
				{letters.map((letter, index) => (
					<span
						key={index}
						className={`text-2xl font-bold ${letter === "." ? "text-gray-500" : ""} animate-bounce`}
						style={{
							animationDelay: `${index * 0.1}s`,
							animationDuration: "1s",
							display: "inline-block",
						}}
					>{letter}</span>
				))}
			</div>
		</div>
	);
};