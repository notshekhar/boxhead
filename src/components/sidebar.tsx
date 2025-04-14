import React, { useState } from "react"

interface ChatItem {
    id: string
    title: string
}

interface SidebarProps {
    chats: ChatItem[]
    onNewChat: () => void
    onSelectChat: (chatId: string) => void
    onToggleSidebar: () => void
    onOpenSearch?: () => void
    isOpen?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({
    chats,
    onNewChat,
    onSelectChat,
    onToggleSidebar,
    onOpenSearch,
    isOpen = true,
}) => {
    const [todayExpanded, setTodayExpanded] = useState(true)
    const [previousExpanded, setPreviousExpanded] = useState(true)
    const [olderExpanded, setOlderExpanded] = useState(true)

    const handleSearchClick = () => {
        if (onOpenSearch) {
            onOpenSearch()
        }
    }

    // We don't need to group chats as we're using static content for the demo

    return (
        <div
            className={`flex flex-col border-r border-gray-light dark:border-gray-700/30 bg-white dark:bg-[#0F0F0F] fixed top-0 bottom-0 left-0 z-30 w-[260px] transition-transform duration-300 ease-out ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
            {/* Header with user info */}
            <div className="px-4 py-3">
                <div className="flex items-center p-2 bg-white dark:bg-[#1E1F25] rounded-lg w-full border border-gray-200 dark:border-gray-700/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-700 text-white mr-2">
                        <span className="font-medium text-sm">N</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                            Personal
                        </h2>
                        <p className="text-xs text-gray-400">Free</p>
                    </div>
                </div>
            </div>

            {/* Navigation items */}
            <div className="px-3 py-2 space-y-1">
                {/* New Chat button */}
                <button
                    onClick={onNewChat}
                    className="w-full py-2 px-3 text-gray-800 dark:text-white text-sm font-medium text-left flex items-center hover:bg-white dark:hover:bg-[#1E1F25] rounded-md transition-colors duration-200 hover:shadow-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    New chat
                </button>

                {/* Libraries */}
                <button className="w-full py-2 px-3 text-gray-800 dark:text-white text-sm font-medium text-left flex items-center justify-between hover:bg-white dark:hover:bg-[#1E1F25] rounded-md transition-colors duration-200 hover:shadow-sm">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        Libraries
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded">
                        Beta
                    </span>
                </button>
            </div>

            {/* Search input */}
            <div className="px-3 py-1">
                <button
                    onClick={handleSearchClick}
                    className="w-full py-2 px-3 text-gray-500 dark:text-gray-400 text-sm font-medium text-left flex items-center hover:bg-white dark:hover:bg-[#1E1F25] rounded-md transition-colors duration-200 hover:shadow-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    Search
                </button>
            </div>

            {/* Upgrade button */}
            <div className="px-3 py-1">
                <button className="w-full py-2 px-3 text-accent-blue text-sm font-medium text-left flex items-center hover:bg-white dark:hover:bg-[#1E1F25] rounded-md transition-colors duration-200 hover:shadow-sm">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                    Upgrade to Pro
                </button>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto py-2 mt-2">
                {/* Today section */}
                <div className="px-3 mb-2">
                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={() => setTodayExpanded(!todayExpanded)}
                            className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-3 w-3 mr-1 transition-transform duration-200 ${
                                    todayExpanded
                                        ? "transform rotate-0"
                                        : "transform -rotate-90"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            Today
                        </button>
                    </div>

                    {todayExpanded && (
                        <div className="space-y-0.5 mt-1">
                            <button
                                onClick={() => onSelectChat("1")}
                                className="w-full text-left px-2 py-2 rounded hover:bg-white dark:hover:bg-[#1E1F25] text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200 hover:shadow-sm"
                            >
                                Wordle Game Canvas
                            </button>
                        </div>
                    )}
                </div>

                {/* Previous 30 days section */}
                <div className="px-3 mb-2">
                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={() =>
                                setPreviousExpanded(!previousExpanded)
                            }
                            className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-3 w-3 mr-1 transition-transform duration-200 ${
                                    previousExpanded
                                        ? "transform rotate-0"
                                        : "transform -rotate-90"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            Previous 30 days
                        </button>
                    </div>

                    {previousExpanded && (
                        <div className="space-y-0.5 mt-1">
                            <button className="w-full text-left px-2 py-2 rounded hover:bg-white dark:hover:bg-[#1E1F25] text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200 hover:shadow-sm">
                                Snake Game Creation
                            </button>
                        </div>
                    )}
                </div>

                {/* Older section */}
                <div className="px-3">
                    <div className="flex items-center justify-between px-2 py-1">
                        <button
                            onClick={() => setOlderExpanded(!olderExpanded)}
                            className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-3 w-3 mr-1 transition-transform duration-200 ${
                                    olderExpanded
                                        ? "transform rotate-0"
                                        : "transform -rotate-90"
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            Older
                        </button>
                    </div>

                    {olderExpanded && (
                        <div className="space-y-0.5 mt-1">
                            {[
                                "Snake Game Tutorial",
                                "Chat Interface",
                                "Mistral Chat Interface",
                                "Random Text Inquiry",
                                "Random Text Inquiry",
                                "Random Text Assistance",
                                "Corrected Input",
                                "Random Text Inquiry",
                                "Random Text Inquiry",
                                "Random Text Inquiry",
                                "Correction Request",
                                "Random Text Inquiry",
                                "Invalid Input",
                                "Clarify Request",
                                "Typo Clarification",
                            ].map((title, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-2 py-2 rounded hover:bg-white dark:hover:bg-[#1E1F25] text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200 hover:shadow-sm"
                                >
                                    {title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* We're removing the user profile section as it's not in the reference image */}

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
