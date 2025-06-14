import React, { useCallback, useState } from "react"
import { useAuth } from "./auth-context"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"
import { errorToast } from "@/hooks/error-toast"
import { CommonPopup } from "@/components/common-popup"
import { BranchOutIcon } from "@/components/common"

interface ChatItem {
    id: string
    pubId: string
    title: string
    parentId?: string
    createdAt?: string | Date
}

interface SidebarProps {
    chats: ChatItem[]
    onNewChat: () => void
    onDeleteChat?: (chatId: string) => void
    onToggleSidebar: () => void
    onOpenSearch?: () => void
    isOpen?: boolean
}

// Mobile Overlay Component
const MobileOverlay = React.memo<{ isOpen: boolean; onClose: () => void }>(
    ({ isOpen, onClose }) => {
        if (!isOpen) return null

        return (
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm z-40 md:hidden"
                onClick={onClose}
            />
        )
    }
)

MobileOverlay.displayName = "MobileOverlay"

// User Info Component
const UserInfo = React.memo(() => {
    const { user, openAuthPopup } = useAuth()

    const handleLogout = async () => {
        try {
            await axios.get("/api/auth/logout")
            // Reload the page to reset the auth state
            window.location.reload()
        } catch (error: unknown) {
            errorToast(error)
        }
    }

    if (user) {
        return (
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
                            if (fallback) fallback.style.display = "flex"
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
                <div className="flex-1">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                        {user.name}
                    </h2>
                    <p className="text-xs text-gray-400">Free</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                    title="Logout"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l4-4m0 0l-4-4m4 4H9"
                        />
                    </svg>
                </button>
            </div>
        )
    }

    return (
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
    )
})

UserInfo.displayName = "UserInfo"

// Navigation Item Component
const NavigationItem = React.memo<{
    icon: React.ReactNode
    label: string
    onClick?: () => void
    badge?: string
    variant?: "default" | "accent"
}>(({ icon, label, onClick, badge, variant = "default" }) => {
    const textColor =
        variant === "accent"
            ? "text-accent-blue"
            : "text-gray-800 dark:text-white"

    return (
        <button
            onClick={onClick}
            className={`w-full py-2 px-3 ${textColor} text-sm font-medium text-left flex items-center justify-between hover:bg-gray-lighter dark:hover:bg-[#1E1F25] rounded-md cursor-pointer`}
        >
            <div className="flex items-center">
                {icon}
                {label}
            </div>
            {badge && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded">
                    {badge}
                </span>
            )}
        </button>
    )
})

NavigationItem.displayName = "NavigationItem"

// Search Button Component
const SearchButton = React.memo<{ onOpenSearch?: () => void }>(
    ({ onOpenSearch }) => {
        const handleSearchClick = () => {
            if (onOpenSearch) {
                onOpenSearch()
            }
        }

        return (
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
        )
    }
)

SearchButton.displayName = "SearchButton"

// Delete Confirmation Modal Component
const DeleteConfirmationModal = React.memo<{
    isOpen: boolean
    chatTitle: string
    isDeleting: boolean
    onConfirm: () => void
    onCancel: () => void
}>(({ isOpen, chatTitle, isDeleting, onConfirm, onCancel }) => {
    return (
        <CommonPopup
            isOpen={isOpen}
            onClose={onCancel}
            title="Delete Chat"
            maxWidth="md"
            showCloseButton={false}
            closeOnBackdropClick={!isDeleting}
        >
            <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to delete "{chatTitle}"? This action
                    cannot be undone.
                </p>
                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <svg
                                    className="w-4 h-4 mr-2 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </CommonPopup>
    )
})

DeleteConfirmationModal.displayName = "DeleteConfirmationModal"

// Chat Item Component
const ChatItemComponent = React.memo<{
    chat: ChatItem
    isSelected: boolean
    onSelect: (pubId: string) => void
    onDelete: (pubId: string) => void
    onDeleteClick: (chat: ChatItem) => void
}>(({ chat, isSelected, onSelect, onDeleteClick }) => {
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDeleteClick(chat)
    }

    return (
        <div
            className={`group w-full text-left px-2 py-2 rounded text-sm cursor-pointer transition-colors flex items-center justify-between ${
                isSelected
                    ? "bg-gray-200 dark:bg-[#2A2B32] text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-lighter dark:hover:bg-[#1E1F25]"
            }`}
            onClick={() => onSelect(chat.pubId)}
        >
            <div className="flex items-center flex-1 min-w-0">
                {chat.parentId && (
                    <div className="flex-shrink-0 mr-2" title="Branched chat">
                        <BranchOutIcon className="text-gray-400 dark:text-gray-500" />
                    </div>
                )}
                <span className="truncate block">{chat.title}</span>
            </div>

            <button
                onClick={handleDeleteClick}
                className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer flex-shrink-0"
                title="Delete chat"
            >
                <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    )
})

ChatItemComponent.displayName = "ChatItemComponent"

// Chat List Component
const ChatList = React.memo<{
    chats: ChatItem[]
    currentChatPubId: string | null
    onDeleteChat?: (pubId: string) => void
    onDeleteClick: (chat: ChatItem) => void
}>(({ chats, currentChatPubId, onDeleteChat, onDeleteClick }) => {
    const router = useRouter()

    const handleChatClick = (pubId: string) => {
        router.push(`/chat/${pubId}`)
    }

    const handleChatDelete = (pubId: string) => {
        if (onDeleteChat) {
            onDeleteChat(pubId)
        }
    }

    return (
        <div className="flex-1 overflow-y-auto py-2 mt-2">
            <div className="px-3 space-y-0.5">
                {chats.map((chat) => {
                    const isSelected = currentChatPubId === chat.pubId
                    return (
                        <ChatItemComponent
                            key={chat.id}
                            chat={chat}
                            isSelected={isSelected}
                            onSelect={handleChatClick}
                            onDelete={handleChatDelete}
                            onDeleteClick={onDeleteClick}
                        />
                    )
                })}
            </div>
        </div>
    )
})

ChatList.displayName = "ChatList"

// Navigation Section Component
const NavigationSection = React.memo<{
    onNewChat: () => void
    onOpenSearch?: () => void
}>(({ onNewChat, onOpenSearch }) => {
    return (
        <>
            {/* Navigation items */}
            <div className="px-3 py-2 space-y-1">
                {/* New Chat button */}
                <NavigationItem
                    icon={
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
                    }
                    label="New chat"
                    onClick={onNewChat}
                />

                {/* Libraries */}
                <NavigationItem
                    icon={
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
                    }
                    label="Libraries"
                    badge="Beta"
                />
            </div>

            {/* Search input */}
            <div className="px-3 py-1">
                <SearchButton onOpenSearch={onOpenSearch} />
            </div>

            {/* Upgrade button */}
            <div className="px-3 py-1">
                <NavigationItem
                    icon={
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
                    }
                    label="Upgrade to Pro"
                    variant="accent"
                />
            </div>
        </>
    )
})

NavigationSection.displayName = "NavigationSection"

// Main Sidebar Component
export const Sidebar: React.FC<SidebarProps> = React.memo(
    ({
        chats,
        onNewChat,
        onDeleteChat,
        onToggleSidebar,
        onOpenSearch,
        isOpen = true,
    }) => {
        const pathname = usePathname()
        const [deleteModalData, setDeleteModalData] = useState<{
            isOpen: boolean
            chat: ChatItem | null
            isDeleting: boolean
        }>({
            isOpen: false,
            chat: null,
            isDeleting: false,
        })

        // Extract the current chat pubId from the URL
        const currentChatPubId = pathname.startsWith("/chat/")
            ? pathname.split("/chat/")[1]
            : null

        const handleDeleteClick = useCallback((chat: ChatItem) => {
            setDeleteModalData({
                isOpen: true,
                chat: chat,
                isDeleting: false,
            })
        }, [])

        const handleConfirmDelete = async () => {
            if (!deleteModalData.chat) return

            setDeleteModalData((prev) => ({ ...prev, isDeleting: true }))
            try {
                await axios.delete("/api/chat", {
                    params: { chatId: deleteModalData.chat.pubId },
                })
                if (onDeleteChat) {
                    onDeleteChat(deleteModalData.chat.pubId)
                }
                setDeleteModalData({
                    isOpen: false,
                    chat: null,
                    isDeleting: false,
                })
            } catch (error: unknown) {
                errorToast(error)
                setDeleteModalData((prev) => ({ ...prev, isDeleting: false }))
            }
        }

        const handleCancelDelete = useCallback(() => {
            setDeleteModalData({
                isOpen: false,
                chat: null,
                isDeleting: false,
            })
        }, [])

        return (
            <>
                <MobileOverlay isOpen={isOpen} onClose={onToggleSidebar} />

                {/* Sidebar */}
                <div
                    className={`flex flex-col border-r border-gray-light dark:border-gray-700/30 bg-white dark:bg-[#0F0F0F] fixed top-0 bottom-0 left-0 z-50 w-[260px] md:w-[260px] transition-transform duration-300 ease-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Header with user info or sign in button */}
                    <div className="px-4 py-3">
                        <UserInfo />
                    </div>

                    <NavigationSection
                        onNewChat={onNewChat}
                        onOpenSearch={onOpenSearch}
                    />

                    <ChatList
                        chats={chats}
                        currentChatPubId={currentChatPubId}
                        onDeleteChat={onDeleteChat}
                        onDeleteClick={handleDeleteClick}
                    />

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

                {/* Full-screen Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModalData.isOpen}
                    chatTitle={deleteModalData.chat?.title || ""}
                    isDeleting={deleteModalData.isDeleting}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            </>
        )
    }
)

Sidebar.displayName = "Sidebar"
