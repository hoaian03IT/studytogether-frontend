import { useEffect, useState } from "react";

export const useDebounce = (value, time) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), time);
		return () => clearTimeout(handler);
	}, [value, time]);
	return debouncedValue;
};