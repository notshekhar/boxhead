/** @type {import('tailwindcss').Config} \*/
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
            // Custom breakpoint for chat messages max-width + 50px
            'chat': '900px',
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            colors: {
                // Primary colors with darker, more muted options
                primary: {
                    light: "#F0F1F3", // Slightly darker off-white for better contrast
                    dark: "#17171F", // Deeper dark background
                },
                secondary: {
                    light: "#E44058", // Crimson red for primary accent
                    dark: "#E53E5B", // Slightly brighter red for dark mode
                },
                accent: {
                    blue: "#2D7FF9", // Deep blue
                    purple: "#7B5CF9", // Deep purple
                    pink: "#D84C78", // Muted pink
                    green: "#10A56B", // Deeper green for success states
                    yellow: "#E09C09", // Deeper yellow for warnings
                    indigo: "#5754D1", // Deep indigo
                    teal: "#0C92C7", // Deeper teal
                    red: "#E22C48", // Error red
                },
                text: {
                    light: "#1A1B25", // Not pure black for better readability
                    dark: "#E8E9EC", // Slightly off-white for dark mode
                    muted: {
                        light: "#5F636E", // Muted text for secondary information
                        dark: "#9597A3", // Muted text for dark mode
                    },
                },
                gray: {
                    light: "#E6E8EC", // Light gray for borders/dividers
                    dark: "#292A33", // Richer dark gray
                    lighter: "#F4F5F7", // Very light gray for hover states
                    darker: "#1D1E26", // Very dark gray for active states
                },
                glass: {
                    light: "rgba(255, 255, 255, 0.9)", // For glass morphism effects
                    dark: "rgba(21, 22, 28, 0.8)", // Dark glass effect
                },
                gradient: {
                    start: "#E22C48", // Red start
                    mid: "#C4314E", // Darker red middle
                    end: "#9C3054", // Purple-red end
                    pink: {
                        start: "#D84C78",
                        end: "#7B5CF9",
                    },
                    blue: {
                        start: "#2D7FF9",
                        end: "#0C92C7",
                    },
                    green: {
                        start: "#10A56B",
                        end: "#0D8456",
                    },
                    orange: {
                        start: "#E09C09",
                        end: "#CC7706",
                    },
                },
                error: {
                    light: "#E22C48",
                    dark: "#FF3A5E",
                    bg: "#281C1F",
                    border: "#442C30",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "noise-dark":
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
                "grid-dark":
                    "linear-gradient(to right, #292A33 1px, transparent 1px), linear-gradient(to bottom, #292A33 1px, transparent 1px)",
            },
            boxShadow: {
                "glass-light": "0 4px 20px 0 rgba(0, 0, 0, 0.05)",
                "glass-dark": "0 4px 20px 0 rgba(0, 0, 0, 0.3)",
                "glow-red":
                    "0 0 10px rgba(226, 44, 72, 0.5), 0 0 20px rgba(226, 44, 72, 0.3)",
                "glow-blue":
                    "0 0 10px rgba(45, 127, 249, 0.5), 0 0 20px rgba(45, 127, 249, 0.3)",
                card: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
                "card-dark":
                    "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                glow: "glow 3s ease-in-out infinite alternate",
                float: "float 6s ease-in-out infinite",
            },
            keyframes: {
                glow: {
                    "0%": { boxShadow: "0 0 5px rgba(226, 44, 72, 0.5)" },
                    "100%": { boxShadow: "0 0 20px rgba(226, 44, 72, 0.8)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
    darkMode: "class", // Enables dark mode via a class (e.g., `dark`)
    plugins: [],
};
