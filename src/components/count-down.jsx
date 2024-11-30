export const CountDown = ({ number }) => {
	let radius = 70;

	return <div className="w-screen h-screen flex items-center justify-center flex-col">
		<style>
			{`
			  @keyframes loading-spin {
				0% { stroke-dashoffset: ${0}; }
				100% { stroke-dashoffset: ${-(radius * Math.PI * 2)}; }
			  }
       	 	`}
		</style>
		<h2 className="text-4xl mb-10">Are you ready?</h2>

		<div className="relative">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
				<circle
					cx="100"
					cy="100"
					r={radius}
					fill="none"
					stroke="#3B82F6"
					strokeWidth={8}
					strokeDasharray={radius * Math.PI * 2}
					strokeLinecap={"round"}
					className="stroke-primary -rotate-90 transform origin-center"
					style={{
						animation: "loading-spin 1s infinite linear",
					}}
				/>
			</svg>
			<div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
				<p className="animate-ping text-6xl text-primary"
				   style={{ animationDuration: "1s" }}>{number}</p>
			</div>
		</div>

	</div>;
};