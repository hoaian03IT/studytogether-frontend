// eslint-disable-next-line no-undef
const { nextui } = require("@nextui-org/theme");
const withMT = require("@material-tailwind/react/utils/withMT");
/** @type {import("tailwindcss").Config} */
export default withMT({
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			keyframes: {
				"spin-half": {
					"0%": { transform: "rotate(0)" },
					"100%": { transform: "rotate(180deg)" },
				},
			},
		},
	},
	darkMode: "class",
	plugins: [
		nextui({
			themes: {
				light: {
					colors: {
						primary: {
							DEFAULT: "#5cc6ee",
							foreground: "#000000",
						},
						focus: "#5cc6ee",
						secondary: {
							DEFAULT: "#FF6636",
							foreground: "#ffffff",
						},
						third: {
							DEFAULT: "#3DCBB1",
							foreground: "#ffffff",
						},
						success: {
							DEFAULT: "#9EDF9C",
							foreground: "#ffffff",
						},
						danger: {
							DEFAULT: "#FF8A8A",
							foreground: "#ffffff",
						},
					},
				},
			},
		}),
	],
});
