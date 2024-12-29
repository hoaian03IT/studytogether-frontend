import clsx from "clsx";
import { useEffect, useState } from "react";
import { GoStarFill } from "react-icons/go";

export const Rating = ({ stars = 5, value = 3, setValue, size = "md", className, color = "yellow" }) => {
	const [current, setCurrent] = useState(value);

	useEffect(() => {
		setCurrent(value);
	}, [value]);

	const handleMouseEnter = (index) => {
		setCurrent(index);
	};
	const handleMouseLeave = () => {
		setCurrent(value);
	};
	const handleChange = () => {
		setValue(current);
	};
	return (
		<div className={className}>
			<div className="flex items-center gap-1">
				{Array.from({ length: stars }).map((_, index) => (
					<button
						key={index}
						type="button"
						onClick={handleChange}
						onMouseEnter={() => handleMouseEnter(index + 1)}
						onMouseLeave={handleMouseLeave}>
						<GoStarFill
							className={clsx(
								"transition-all hover:scale-125",
								index + 1 <= current ? `text-${color}-700` : "text-gray-400",
								size === "sm"
									? "size-8"
									: size === "md"
									? "size-10"
									: size === "lg"
									? "size-12"
									: size === "xs"
									? "size-8"
									: size === "tiny"
									? "size-5"
									: "",
							)}
						/>
					</button>
				))}
			</div>
		</div>
	);
};
