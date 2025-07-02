"use client"

import React from "react"

interface ScrollToBottomButtonProps {
    onClick: () => void
    isVisible: boolean
}

export const ScrollToBottomButton = React.memo(({ onClick, isVisible }: ScrollToBottomButtonProps) => {
    if (!isVisible) return null

    return (
        <div className="flex justify-center mb-2">
            <button
                onClick={onClick}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#2D7FF9] dark:hover:border-[#2D7FF9] transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md text-sm font-medium cursor-pointer"
                aria-label="Scroll to bottom"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7 13L12 18L17 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 6L12 11L17 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <span>Scroll to bottom</span>
            </button>
        </div>
    )
})