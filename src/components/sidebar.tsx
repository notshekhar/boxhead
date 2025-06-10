import React, { useState } from "react"
import { useAuth } from "./auth-context"
import { useRouter, usePathname } from "next/navigation"

interface ChatItem {
    id: string
    pubId: string
    title: string
    createdAt?: string | Date
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
    const { user, openAuthPopup } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Extract the current chat pubId from the URL
    const currentChatPubId = pathname.startsWith('/chat/') ? pathname.split('/chat/')[1] : null

    const handleSearchClick = () => {
        if (onOpenSearch) {
            onOpenSearch()
        }
    }

    const handleChatClick = (pubId: string) => {
        router.push(`/chat/${pubId}`)
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={onToggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`flex flex-col border-r border-gray-light dark:border-gray-700/30 bg-white dark:bg-[#0F0F0F] fixed top-0 bottom-0 left-0 z-50 w-[260px] md:w-[260px] transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header with user info or sign in button */}
                <div className="px-4 py-3">
                    {user ? (
                        <div className="flex items-center p-2 bg-white dark:bg-[#1E1F25] rounded-lg w-full border border-gray-200 dark:border-gray-700/30">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full mr-2 object-cover"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none"
                                        const fallback = e.currentTarget
                                            .nextElementSibling as HTMLElement
                                        if (fallback)
                                            fallback.style.display = "flex"
                                    }}
                                />
                            ) : null}
                            <div
                                className={`items-center justify-center w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-700 text-white mr-2 ${
                                    user.avatar ? "hidden" : "flex"
                                }`}
                            >
                                <span className="font-medium text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                                    {user.name}
                                </h2>
                                <p className="text-xs text-gray-400">Free</p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={openAuthPopup}
                            className="flex items-center justify-center p-3 bg-white dark:bg-[#1E1F25] rounded-lg w-full border border-gray-200 dark:border-gray-700/30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                Sign In
                            </span>
                        </button>
                    )}
                </div>

                {/* Navigation items */}
                <div className="px-3 py-2 space-y-1">
                    {/* New Chat button */}
                    <button
                        onClick={onNewChat}
                        className="w-full py-2 px-3 text-gray-800 dark:text-white text-sm font-medium text-left flex items-center hover:bg-gray-lighter dark:hover:bg-[#1E1F25] rounded-md cursor-pointer"
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
                    <button className="w-full py-2 px-3 text-gray-800 dark:text-white text-sm font-medium text-left flex items-center justify-between hover:bg-gray-lighter dark:hover:bg-[#1E1F25] rounded-md cursor-pointer">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="h-4 w-4 mr-3"
                            >
                                <path d="m16 6 4 14"></path>
                                <path d="M12 6v14"></path>
                                <path d="M8 8v12"></path>
                                <path d="M4 4v16"></path>
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
                        className="w-full py-2 px-3 text-gray-500 dark:text-gray-400 text-sm font-medium text-left flex items-center hover:bg-gray-lighter dark:hover:bg-[#1E1F25] rounded-md cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="h-4 w-4 mr-3"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        Search
                    </button>
                </div>

                {/* Upgrade button */}
                <div className="px-3 py-1">
                    <button className="w-full py-2 px-3 text-accent-blue text-sm font-medium text-left flex items-center hover:bg-gray-lighter dark:hover:bg-[#1E1F25] rounded-md cursor-pointer">
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
                    <div className="px-3 space-y-0.5">
                        {chats.map((chat) => {
                            const isSelected = currentChatPubId === chat.pubId
                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat.pubId)}
                                    className={`w-full text-left px-2 py-2 rounded text-sm cursor-pointer transition-colors ${
                                        isSelected
                                            ? "bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-lighter dark:hover:bg-[#1E1F25]"
                                    }`}
                                >
                                    <span className="truncate block">
                                        {chat.title}
                                    </span>
                                </button>
                            )
                        })}
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
        </>
    )
}
