"use client"

import * as React from "react"
import { useTheme } from "next-themes"

// Basic SVG icons for Sun and Moon
const SunIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
    </svg>
))

const MoonIcon = React.memo((props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
))

export const ThemeToggleButton = React.memo(() => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Ensure the component is mounted before rendering UI that depends on the theme
    // This prevents hydration mismatch issues
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        // Render a placeholder or null during server-side rendering and hydration
        return <div className="w-10 h-10"></div> // Placeholder with same size
    }

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <button
            onClick={toggleTheme}
            className="bg-white dark:bg-[#27272A] rounded-xl border border-gray-100 dark:border-0 px-2 py-1.5 focus:outline-none cursor-pointer"
            aria-label={
                theme === "light"
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            }
        >
            <div className="flex items-center gap-0.5">
                <div className="p-1 text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200 cursor-pointer">
                    {theme === "light" ? (
                        <MoonIcon className="w-4 h-4" />
                    ) : (
                        <SunIcon className="w-4 h-4" />
                    )}
                </div>
            </div>
        </button>
    )
})
