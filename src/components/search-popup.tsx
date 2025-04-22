import React, { useRef, useEffect } from "react"

interface ChatItem {
    id: string
    title: string
}

interface SearchPopupProps {
    isOpen: boolean
    onClose: () => void
    onSelectChat: (chatId: string) => void
    recentChats: ChatItem[]
}

export const SearchPopup: React.FC<SearchPopupProps> = ({
    isOpen,
    onClose,
    onSelectChat,
    recentChats,
}) => {
    const searchPopupRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchPopupRef.current &&
                !searchPopupRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            {/* Backdrop overlay */}
            <div
                className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Search modal */}
            <div
                ref={searchPopupRef}
                className="relative bg-white/90 dark:bg-[#1E1F25]/90 backdrop-blur-sm rounded-xl border-0 overflow-hidden max-h-[500px] w-[90%] max-w-[500px] shadow-lg"
                style={{
                    animation: "fadeIn 0.3s ease-out forwards",
                }}
            >
                <div className="p-3 border-b border-gray-200/5 dark:border-gray-700/5">
                    <div className="flex items-center bg-transparent dark:bg-transparent border-0 rounded-lg px-1 py-1">
                        <div className="flex items-center mr-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="lucide lucide-search ml-px !size-4"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="lucide lucide-slash ml-[3px] !size-4 skew-x-[30deg] opacity-20"
                            >
                                <path d="M22 2 2 22"></path>
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                className="lucide lucide-plus mr-3 !size-4"
                            >
                                <path d="M5 12h14"></path>
                                <path d="M12 5v14"></path>
                            </svg>
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:ring-0 py-0.5"
                            placeholder="Search or press Enter to start new chat..."
                        />
                    </div>
                </div>

                <div className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 dark:text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Recent Chats</span>
                    </div>

                    <div className="space-y-1">
                        {recentChats.map((chat, index) => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    onSelectChat(chat.id)
                                    onClose()
                                }}
                                className="w-full text-left px-2 py-2.5 hover:bg-gray-100/10 dark:hover:bg-gray-800/20 transition-all duration-200 text-sm animate-slideIn"
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                    animation: "slideIn 0.2s ease-out forwards",
                                }}
                            >
                                {chat.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
