import { RangeCalendar } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useRecoilValue } from "recoil";
import { streakState } from "../recoil/atoms/streak.atom";
import { userRangeStreak } from "../recoil/selectors";
import { useEffect, useState } from "react";

export const CalendarStreak = () => {
	const streak = useRecoilValue(streakState);
	const rangeStreak = useRecoilValue(userRangeStreak);
	const [calculated, setCalculated] = useState({ start: null, end: null });

	useEffect(() => {
		console.log(streak);
		if (rangeStreak === 1 && streakState?.currentStreak > 0) {
			const start = today(getLocalTimeZone()).subtract({ days: streakState?.currentStreak });
			const end = today(getLocalTimeZone()).subtract({ days: 1 });
			setCalculated({ start, end });
		} else if (rangeStreak === 0) {
			const start = today(getLocalTimeZone()).subtract({ days: streakState?.currentStreak });
			const end = today(getLocalTimeZone());
			setCalculated({ start, end });
		} else {
			setCalculated({ start: null, end: null });
		}
	}, [rangeStreak, streak]);

	return (
		<RangeCalendar
			aria-label="Date (Uncontrolled)"
			isReadOnly={true}
			defaultValue={
				calculated?.start && calculated?.end ? { start: calculated?.start, end: calculated.end } : null
			}
		/>
	);
};
