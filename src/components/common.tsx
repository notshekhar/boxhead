import React, { useCallback, useState } from "react"

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
