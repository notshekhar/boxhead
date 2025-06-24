import { UIMessage } from "ai"
import React from "react"
import { MemoizedMarkdown } from "./markdown-chunks"
import { CopyButton, BranchOutButton } from "./common"
import { ChatMessageParts } from "./chat-message-parts"

export const ChatMessage: React.FC<{
    message: UIMessage
    messageIndex: number
    isLoading?: boolean
}> = React.memo(
    ({
        message,
        messageIndex,
        isLoading = false,
    }: {
        message: UIMessage
        isLoading?: boolean
        messageIndex: number
    }) => {
        if (message.role === "user") {
            return (
                <div className="flex flex-col items-end mb-6 group">
                    <div className="max-w-[80%] bg-white dark:bg-gray-darker rounded-xl py-3 px-4 border border-gray-light dark:border-gray-dark mr-2 overflow-x-scroll">
                        <div className="text-base text-text-light dark:text-text-dark break-words overflow-wrap-anywhere">
                            <MemoizedMarkdown>
                                {message.content}
                            </MemoizedMarkdown>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <CopyButton text={message.content} label="Copy" />
                    </div>
                </div>
            )
        }

        return (
            <ChatMessageParts
                isLoading={isLoading}
                message={message}
                messageIndex={messageIndex}
                key={messageIndex}
            />
        )
    }
)
