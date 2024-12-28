import { selector } from "recoil";
import { streakState } from "./atoms/streak.atom";

export const userRangeStreak = selector({
	key: "userRangeStreak",
	get: ({ get }) => {
		const streak = get(streakState);
		const distanceFromLastDateToToday = streak.lastCompletedDate
			? Math.floor((new Date() - new Date(streak.lastCompletedDate)) / (1000 * 60 * 60 * 24))
			: 0;

		return distanceFromLastDateToToday;
	},
});
