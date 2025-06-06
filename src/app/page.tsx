"use client"

import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { EmptyState } from "@/components/empty-state"
import { HeaderControls } from "@/components/header-controls"
import { useState, useEffect } from "react"
import { SearchPopup } from "@/components/search-popup"
import { useChat } from "ai/react"

interface Message {
    id: string
    content: string
    type: "user" | "ai"
}

interface Chat {
    id: string
    title: string
    messages: Message[]
}

const chats = [
    {
        id: "1",
        title: "Generate Image",
        messages: [],
    },
]

export default function Home() {
    const [sidebarVisible, setSidebarVisible] = useState<boolean>(true)
    const [showSearchPopup, setShowSearchPopup] = useState<boolean>(false)

    // useChat hook for API integration
    const { messages, input, setInput, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        experimental_prepareRequestBody: ({ messages }) => {
            return {
                model_provider: "google",
                model_name: "gemini-2.0-flash-lite",
                messages,
            }
        },

        credentials: "include",
    })

    const handleToggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    const handleNewChat = () => {
        const newChat: Chat = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: [],
        }
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F5F5] dark:bg-[#0F0F0F] text-text-light dark:text-text-dark relative">
            {/* Search Popup */}
            <SearchPopup
                isOpen={showSearchPopup}
                onClose={() => setShowSearchPopup(false)}
                onSelectChat={() => {}}
                recentChats={chats}
            />

            {/* Sidebar - always rendered but positioned off-screen when not visible */}
            <Sidebar
                chats={chats}
                onNewChat={handleNewChat}
                onSelectChat={() => {}}
                onToggleSidebar={handleToggleSidebar}
                onOpenSearch={() => setShowSearchPopup(true)}
                isOpen={sidebarVisible}
            />

            {/* Main chat area */}
            <div
                className={`flex-1 flex flex-col backdrop-blur-[2px] z-10 transition-all duration-300 ease-out ${
                    sidebarVisible ? "ml-[260px]" : "ml-0"
                }`}
            >
                {/* Floating controls when sidebar is closed */}
                {!sidebarVisible ? (
                    <>
                        <div className="absolute top-4 left-4 z-20">
                            <HeaderControls
                                key={`header-controls-${sidebarVisible}`}
                                onToggleSidebar={handleToggleSidebar}
                                onNewChat={handleNewChat}
                                onOpenSearch={() => setShowSearchPopup(true)}
                            />
                        </div>
                        <div className="absolute top-4 right-4 z-20">
                            <ThemeToggleButton />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Sidebar toggle button positioned at the edge of the sidebar */}
                        <div
                            className="fixed top-4 z-50"
                            style={{ left: "25px", top: "25px" }}
                        >
                            <button
                                onClick={handleToggleSidebar}
                                className="text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200 cursor-pointer"
                                style={{ transform: "translateX(-50%)" }}
                            >
                                <svg
                                    width="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.47108 18.9992 8.26339 19 9.4 19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H9.4C8.26339 5 7.47108 5.00078 6.85424 5.05118ZM7 7C7.55229 7 8 7.44772 8 8V16C8 16.5523 7.55229 17 7 17C6.44772 17 6 16.5523 6 16V8C6 7.44772 6.44772 7 7 7Z"
                                        fill="currentColor"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="absolute top-4 right-4 z-20">
                            <ThemeToggleButton />
                        </div>
                    </>
                )}

                {/* Messages container */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
                    {messages.length === 0 ? (
                        <EmptyState username="Amélie" />
                    ) : (
                        <div className="px-4 sm:px-8 md:px-16 py-6 max-w-[850px] mx-auto w-full">
                            {messages.map((message) => (
                                <ChatMessage message={message} />
                            ))}
                            {isLoading && "Thinking..."}
                        </div>
                    )}
                </div>
                {input}
                <ChatInput
                    input={input}
                    setInput={setInput}
                    onSendMessage={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}
