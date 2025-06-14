import React, { useRef, useEffect, useState, useCallback } from "react"
import axios from "axios"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

interface ChatItem {
    id: string
    pubId: string
    title: string
    createdAt?: string
    parentId?: string
    total?: number
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
    
    const [searchQuery, setSearchQuery] = useState("")
    const [displayChats, setDisplayChats] = useState<ChatItem[]>(recentChats)
    const [isSearching, setIsSearching] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    
    // Debounce the search query with 500ms delay
    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    // Debounced search function
    const searchChats = useCallback(async (query: string) => {
        if (!query.trim()) {
            setDisplayChats(recentChats)
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        try {
            const response = await axios.get("/api/chats", {
                params: {
                    search: query,
                    page: 1
                },
                withCredentials: true,
            })
            const data = response.data
            setDisplayChats(data?.chats || [])
        } catch (error) {
            console.error("Search error:", error)
            setDisplayChats([])
        } finally {
            setIsSearching(false)
        }
    }, [recentChats])

    // Trigger search when debounced query changes
    useEffect(() => {
        searchChats(debouncedSearchQuery)
    }, [debouncedSearchQuery, searchChats])

    // Reset search when popup opens/closes
    useEffect(() => {
        if (isOpen) {
            setSearchQuery("")
            setDisplayChats(recentChats)
            setSelectedIndex(-1)
        }
    }, [isOpen, recentChats])

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex(prev => prev < displayChats.length - 1 ? prev + 1 : prev)
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (selectedIndex >= 0 && selectedIndex < displayChats.length) {
                const selectedChat = displayChats[selectedIndex]
                onSelectChat(selectedChat.pubId)
                onClose()
            } else if (searchQuery.trim() === "") {
                // Start new chat if no search query
                window.location.href = "/"
            }
        } else if (e.key === "Escape") {
            e.preventDefault()
            onClose()
        }
    }, [displayChats, selectedIndex, onSelectChat, onClose, searchQuery])

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

    const isShowingSearchResults = searchQuery.trim() && !isSearching && displayChats !== recentChats

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
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setSelectedIndex(-1) // Reset selection when typing
                            }}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:ring-0 py-0.5"
                            placeholder="Search or press Enter to start new chat..."
                        />
                        {isSearching && (
                            <div className="ml-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
                            </div>
                        )}
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
                        <span>
                            {isShowingSearchResults 
                                ? `Search Results ${displayChats.length > 0 ? `(${displayChats.length})` : '(No results found)'}` 
                                : "Recent Chats"
                            }
                        </span>
                    </div>

                    <div className="space-y-1">
                        {displayChats.length > 0 ? (
                            displayChats.map((chat, index) => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        onSelectChat(chat.pubId)
                                        onClose()
                                    }}
                                    className={`w-full text-left px-2 py-2.5 transition-all duration-200 text-sm animate-slideIn rounded-md ${
                                        selectedIndex === index
                                            ? "bg-gray-200/20 dark:bg-gray-700/30"
                                            : "hover:bg-gray-100/10 dark:hover:bg-gray-800/20"
                                    }`}
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: "slideIn 0.2s ease-out forwards",
                                    }}
                                >
                                    {chat.title}
                                </button>
                            ))
                        ) : isShowingSearchResults && displayChats.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No chats found matching "{searchQuery}"
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
