import React, { useCallback, useState } from "react"
import { UIMessage } from "ai"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useRouter } from "next/navigation"
import { CommonPopup } from "./common-popup"
import { errorToast } from "@/hooks/error-toast"

// Copy icon component
export const CopyIcon = React.memo(({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
))

// Check icon component for copied state
export const CheckIcon = React.memo(({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20,6 9,17 4,12" />
    </svg>
))

// Branch out icon component (git branch)
export const BranchOutIcon = React.memo(({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="6" y1="3" x2="6" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="m18 9a9 9 0 0 1-9 9" />
    </svg>
))

// Custom hook for copy functionality
const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            try {
                const textArea = document.createElement("textarea")
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand("copy")
                document.body.removeChild(textArea)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            } catch (fallbackErr) {
                console.error("Failed to copy:", fallbackErr)
            }
        }
    }

    return { isCopied, copyToClipboard }
}

// Copy button component
export const CopyButton = React.memo(
    ({ text, label = "Copy" }: { text: string; label?: string }) => {
        const { isCopied, copyToClipboard } = useCopyToClipboard()

        return (
            <button
                onClick={() => copyToClipboard(text)}
                className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors cursor-pointer ${
                    isCopied
                        ? "text-green-600 dark:text-green-400"
                        : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark"
                }`}
                title={isCopied ? "Copied!" : `Copy ${label.toLowerCase()}`}
                disabled={isCopied}
            >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                {isCopied ? "Copied" : label}
            </button>
        )
    }
)

// Branch Confirmation Modal Component
const BranchConfirmationModal = React.memo<{
    isOpen: boolean
    isBranching: boolean
    onConfirm: () => void
    onCancel: () => void
}>(({ isOpen, isBranching, onConfirm, onCancel }) => {
    return (
        <CommonPopup
            isOpen={isOpen}
            onClose={onCancel}
            title="Branch Conversation"
            maxWidth="md"
            showCloseButton={false}
            closeOnBackdropClick={!isBranching}
        >
            <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    This will create a new conversation branch from this point. You can continue the conversation from here in a separate thread.
                </p>
                <div className="flex space-x-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isBranching}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isBranching}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isBranching ? (
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
                                Creating Branch...
                            </>
                        ) : (
                            "Create Branch"
                        )}
                    </button>
                </div>
            </div>
        </CommonPopup>
    )
})

BranchConfirmationModal.displayName = "BranchConfirmationModal"

// Branch out button component
export const BranchOutButton = React.memo(
    ({ 
        text, 
        label = "Branch Out",
        messages,
        chatId,
        model,
        messageIndex
    }: { 
        text: string
        label?: string
        messages?: UIMessage[]
        chatId?: string
        model?: string
        messageIndex?: number
    }) => {
        const [modalData, setModalData] = useState<{
            isOpen: boolean
            isBranching: boolean
        }>({
            isOpen: false,
            isBranching: false,
        })
        const router = useRouter()

        const handleBranchOut = useCallback(async () => {
            if (!messages || !chatId || !model || messageIndex === undefined) {
                console.error("Missing required props for branching")
                return
            }

            setModalData(prev => ({ ...prev, isBranching: true }))
            
            try {
                // Generate new UUID for the branch
                const newChatId = uuidv4()
                
                // Get messages up to the current point (including the assistant message)
                const messagesToBranch = messages.slice(0, messageIndex + 1)
                
                // Make API call to create branch
                const response = await axios.post('/api/chat/branch', {
                    id: newChatId,
                    parentId: chatId,
                    messages: messagesToBranch,
                    model: model
                }, {
                    withCredentials: true
                })

                if (response.status === 200) {
                    // Redirect to the new branch chat
                    router.push(`/chat/${newChatId}`)
                }
            } catch (error) {
                console.error("Failed to create branch:", error)
                errorToast(error)
                setModalData(prev => ({ ...prev, isBranching: false }))
            } finally {
                setModalData({
                    isOpen: false,
                    isBranching: false,
                })
            }
        }, [messages, chatId, model, messageIndex, router])

        const handleOpenModal = useCallback(() => {
            setModalData({
                isOpen: true,
                isBranching: false,
            })
        }, [])

        const handleCloseModal = useCallback(() => {
            setModalData({
                isOpen: false,
                isBranching: false,
            })
        }, [])

        return (
            <>
                <button
                    onClick={handleOpenModal}
                    disabled={!messages || !chatId || !model || messageIndex === undefined}
                    className="flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors cursor-pointer text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    title={label}
                >
                    <BranchOutIcon />
                    {label}
                </button>

                <BranchConfirmationModal
                    isOpen={modalData.isOpen}
                    isBranching={modalData.isBranching}
                    onConfirm={handleBranchOut}
                    onCancel={handleCloseModal}
                />
            </>
        )
    }
)
