import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			animation: {
				confetti: "confetti 3s linear infinite",
			},
			keyframes: {
				confetti: {
					"0%": { transform: "translateY(0) rotateX(0) rotateY(0)", opacity: "1" },
					"100%": {
						transform: "translateY(100vh) rotateX(360deg) rotateY(180deg)",
						opacity: "0",
					},
				},
			},
			screens: {
				xs: "300px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
			},
			fontFamily: {
				sans: [
					"var(--font-sans)",
					"ui-sans-serif",
					"system-ui",
					"-apple-system",
					"Segoe UI",
					"Roboto",
					"Helvetica",
					"Arial",
					"Noto Sans",
					"sans-serif",
				],
			},
		},
	},
	plugins: [],
};

export default config;
