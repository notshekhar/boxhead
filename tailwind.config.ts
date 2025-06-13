import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            keyframes: {
                bounce: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(0.5)" },
                },
                pulse: {
                    "0%, 100%": { transform: "scale(0.3)" },
                    "50%": { transform: "scale(1.2)" },
                },
            },
        },
    },
    plugins: [],
}

export default config 