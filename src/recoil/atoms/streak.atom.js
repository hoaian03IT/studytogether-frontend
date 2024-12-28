import { atom } from "recoil";

export const streakState = atom({
	key: "streakState",
	default: {
		currentStreak: 0,
		maxStreak: 0,
		lastCompletedDate: new Date(),
	},
});
