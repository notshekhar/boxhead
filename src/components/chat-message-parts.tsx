import { UIMessage } from "ai"
import React, { useState } from "react"
import { MemoizedMarkdown } from "./markdown-chunks"
import { BranchOutButton, CopyButton } from "./common"
import { MemoizedMarkdownReasoning } from "./markdown-reasoning-chunks"

// Loading spinner component
const LoadingSpinner = React.memo(() => (
    <svg
        className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400"
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
))

// Chevron icon component for expand/collapse
const ChevronIcon = React.memo(
    ({
        isExpanded,
        className,
    }: {
        isExpanded: boolean
        className?: string
    }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${
                isExpanded ? "rotate-90" : "rotate-0"
            } ${className}`}
        >
            <polyline points="9,18 15,12 9,6" />
        </svg>
    )
)

// Expandable reasoning component
const ReasoningSection = React.memo(
    ({
        reasoning,
        isReasoningLoading,
    }: {
        reasoning: string
        isReasoningLoading: boolean
    }) => {
        const [isExpanded, setIsExpanded] = useState(false)

        return (
            <div className="mb-4 border-l-2 border-blue-200 dark:border-blue-800">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group cursor-pointer"
                    aria-expanded={isExpanded}
                    aria-controls="reasoning-content"
                >
                    <ChevronIcon
                        isExpanded={isExpanded}
                        className="flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-200"
                    />
                    {isReasoningLoading && <LoadingSpinner />}
                    <span className="flex-1">Reasoning</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 opacity-70">
                        {isExpanded ? "Click to collapse" : "Click to expand"}
                    </span>
                </button>

                <div
                    id="reasoning-content"
                    className={`ml-6 transition-all duration-200 overflow-hidden ${
                        isExpanded
                            ? "opacity-100 px-3 py-3 animate-slide-up"
                            : "max-h-0 opacity-0 py-0"
                    }`}
                >
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <MemoizedMarkdownReasoning>
                            {reasoning}
                        </MemoizedMarkdownReasoning>
                    </div>
                </div>
            </div>
        )
    }
)

export const ChatMessageParts = React.memo(
    ({
        message,
        isLoading,
        messageIndex,
    }: {
        message: UIMessage
        isLoading: boolean
        messageIndex: number
    }) => {
        const isReasoningLoading = React.useMemo(() => {
            return (
                message.parts.length > 0 &&
                message.parts[message.parts.length - 1].type === "reasoning"
            )
        }, [message.parts.length])

        return (
            <div>
                {message.parts.map((part, index) => {
                    if (part.type === "text") {
                        return (
                            <div key={index} className="flex mb-6 items-start">
                                <div className="max-w-[100%] px-1 min-w-0">
                                    <div className="text-base text-text-light dark:text-text-dark leading-relaxed break-words overflow-wrap-anywhere">
                                        <MemoizedMarkdown>
                                            {message.content}
                                        </MemoizedMarkdown>
                                    </div>
                                    {!isLoading && (
                                        <div className="flex justify-start gap-2 mt-3">
                                            <CopyButton
                                                text={message.content}
                                                label="Copy"
                                            />
                                            <BranchOutButton
                                                messageIndex={messageIndex}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    } else if (part.type === "reasoning") {
                        return (
                            <ReasoningSection
                                key={index}
                                reasoning={part.reasoning}
                                isReasoningLoading={isReasoningLoading}
                            />
                        )
                    }
                })}
            </div>
        )
    }
)
