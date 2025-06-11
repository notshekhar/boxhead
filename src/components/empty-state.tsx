import React, { useState, useEffect } from "react"

interface EmptyStateProps {
    username?: string
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({
    username = "there",
}) => {
    const displayName = username === "there" ? "there" : username

    // State to control animation
    const [isVisible, setIsVisible] = useState(false)

    // Trigger animation when component mounts
    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 max-w-md mx-auto relative">
            {/* Glass effect around the content - only in light mode */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl border border-white/20 pointer-events-none dark:hidden"></div>

            <div
                className={`w-full space-y-3 mb-10 ${
                    isVisible ? "animate-fade-in" : "opacity-0"
                }`}
            >
                <h3 className="text-gray-500 dark:text-gray-400 text-xl font-normal">
                    Hi {displayName}
                </h3>
            </div>
        </div>
    )
})
