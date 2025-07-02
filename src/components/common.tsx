import React, { useCallback, useState } from "react"
import { UIMessage } from "ai"
import { v4 as uuidv4, v4 } from "uuid"
import axios from "axios"
import { useRouter } from "next/navigation"

import { errorToast } from "@/hooks/error-toast"
import { useChatContext } from "./chat-context"
import { useModels } from "./models-context"
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

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
export const BranchOutIcon = React.memo(
    ({ className }: { className?: string }) => (
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
    )
)

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
    ({ text, label = "Copy", iconOnly = false }: { text: string; label?: string; iconOnly?: boolean }) => {
        const { isCopied, copyToClipboard } = useCopyToClipboard()

        const buttonContent = (
            <button
                onClick={() => copyToClipboard(text)}
                className={`flex items-center ${iconOnly ? 'gap-0 p-2' : 'gap-1.5 px-2 py-1'} text-sm rounded transition-colors cursor-pointer ${
                    isCopied
                        ? "text-green-600 dark:text-green-400"
                        : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark"
                }`}
                title={iconOnly ? undefined : (isCopied ? "Copied!" : `Copy ${label.toLowerCase()}`)}
                disabled={isCopied}
            >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                {!iconOnly && (isCopied ? "Copied" : label)}
            </button>
        )

        if (iconOnly) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isCopied ? "Copied!" : "Copy"}</p>
                    </TooltipContent>
                </Tooltip>
            )
        }

        return buttonContent
    }
)

// Branch Confirmation Modal Component
export const BranchConfirmationModal = React.memo<{
    isOpen: boolean
    isBranching: boolean
    onConfirm: () => void
    onCancel: () => void
}>(({ isOpen, isBranching, onConfirm, onCancel }) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Branch Conversation</DialogTitle>
                    <DialogDescription>
                        This will create a new conversation branch from this point.
                        You can continue the conversation from here in a separate
                        thread.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isBranching}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isBranching}
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
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

BranchConfirmationModal.displayName = "BranchConfirmationModal"

// Branch out button component
export const BranchOutButton = React.memo(
    ({
        messageIndex,
        label = "Branch Off",
        iconOnly = false,
    }: {
        messageIndex: number
        label?: string
        iconOnly?: boolean
    }) => {
        const router = useRouter()
        const { messages, chatId } = useChatContext()
        const { selectedModel } = useModels()

        const [showBranchConfirmationModal, setShowBranchConfirmationModal] =
            useState<boolean>(false)
        const [isBranching, setIsBranching] = useState<boolean>(false)

        const handleBranchOut = useCallback(async () => {
            if (!messages || !chatId || !selectedModel || messageIndex === -1) {
                console.error("Missing required props for branching")
                return
            }

            try {
                setIsBranching(true)
                // Generate new UUID for the branch
                const newChatId = v4()

                // Get messages up to the current point (including the assistant message)
                const messagesToBranch = messages.slice(0, messageIndex + 1)

                // Make API call to create branch
                const response = await axios.post(
                    "/api/chat/branch",
                    {
                        id: newChatId,
                        parentId: chatId,
                        messages: messagesToBranch,
                        model: selectedModel.name,
                    },
                    {
                        withCredentials: true,
                    }
                )

                if (response.status === 200) {
                    // Redirect to the new branch chat
                    router.push(`/chat/${newChatId}`)
                } else {
                    setIsBranching(false)
                }
            } catch (error) {
                console.error("Failed to create branch:", error)
                errorToast(error)
                setIsBranching(false)
            }
        }, [])

        const buttonContent = (
            <button
                onClick={() => {
                    setShowBranchConfirmationModal(true)
                }}
                className={`flex items-center ${iconOnly ? 'gap-0 p-2' : 'gap-1.5 px-2 py-1'} text-sm rounded transition-colors cursor-pointer text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark disabled:opacity-50 disabled:cursor-not-allowed`}
                title={iconOnly ? undefined : label}
            >
                <BranchOutIcon />
                {!iconOnly && label}
            </button>
        )

        return (
            <>
                <BranchConfirmationModal
                    isOpen={showBranchConfirmationModal}
                    isBranching={isBranching}
                    onConfirm={handleBranchOut}
                    onCancel={() => {
                        if (!isBranching) {
                            setShowBranchConfirmationModal(false)
                            setIsBranching(false)
                        }
                    }}
                />
                {iconOnly ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {buttonContent}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Branch off</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    buttonContent
                )}
            </>
        )
    }
)
