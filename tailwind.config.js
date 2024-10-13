// eslint-disable-next-line no-undef
const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
export default {
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
                        "my-primary": {
                            DEFAULT: "#83cbe3",
                            foreground: "#000000",
                        },
                        focus: "#83cbe3",
                        secondary: {
                            DEFAULT: "#ff971e",
                            foreground: "#000000",
                        },
                    },
                },
            },
        }),
    ],
};
