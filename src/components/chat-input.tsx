import React, { useState, useRef, useEffect } from "react"

// Type definitions
interface ChatInputProps {
    onSendMessage: (message: string, files?: File[]) => void
}

interface FilePreview {
    file: File
    preview: string
}

// Custom hook for chat input logic
function useChatInput(
    onSendMessage: (message: string, files?: File[]) => void
) {
    // State
    const [message, setMessage] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const [attachedFiles, setAttachedFiles] = useState<FilePreview[]>([])

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State to track if textarea has expanded beyond its initial height
    const [isExpanded, setIsExpanded] = useState(false)

    // Auto-resize textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            // Save the current scroll position
            const scrollPos = window.scrollY

            // Reset height to auto to get the correct scrollHeight
            textarea.style.height = "auto"

            // Set the new height with a minimum of 24px and maximum of 150px
            const initialHeight = 24 // Initial height in pixels
            const newHeight = Math.min(
                Math.max(textarea.scrollHeight, initialHeight),
                150
            )
            textarea.style.height = `${newHeight}px`

            // Check if textarea has expanded beyond initial height
            setIsExpanded(newHeight > initialHeight + 5) // +5 for a small buffer

            // Restore the scroll position to prevent page jump
            window.scrollTo(0, scrollPos)
        }
    }, [message])

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            attachedFiles.forEach((file) => URL.revokeObjectURL(file.preview))
        }
    }, [attachedFiles])

    // File handling methods
    const handleFiles = (files: File[]) => {
        const newFiles = files.map((file) => {
            const preview = URL.createObjectURL(file)
            return { file, preview }
        })

        setAttachedFiles((prev) => [...prev, ...newFiles])
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFiles(Array.from(event.target.files))
        }
    }

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => {
            const newFiles = [...prev]
            URL.revokeObjectURL(newFiles[index].preview)
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files))
        }
    }

    // Message handling
    const handleSendMessage = () => {
        if (message.trim() || attachedFiles.length > 0) {
            onSendMessage(
                message,
                attachedFiles.map((f) => f.file)
            )
            setMessage("")
            // Clean up previews and reset files
            attachedFiles.forEach((file) => URL.revokeObjectURL(file.preview))
            setAttachedFiles([])
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Return all the state and handlers needed by the UI
    return {
        // State
        message,
        isDragging,
        attachedFiles,
        isExpanded,

        // Refs
        textareaRef,
        fileInputRef,

        // Handlers
        setMessage,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        handleSendMessage,
        handleKeyDown,
    }
}

// UI Components
const SendButton: React.FC<{
    onClick: () => void
    disabled: boolean
    isExpanded?: boolean
}> = ({ onClick, disabled, isExpanded = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 bg-[#2D7FF9] text-white rounded-lg transition-all duration-200 ${
            isExpanded ? "self-start" : "self-center"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        aria-label="Send message"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
            />
        </svg>
    </button>
)

const ModelSelector: React.FC = () => (
    <button className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200">
        <div className="w-2.5 h-2.5 rounded-full bg-[#2D7FF9] mr-1.5"></div>
        <span>UUI v6.0</span>
    </button>
)

const FileAttachButton: React.FC<{
    onClick: () => void
}> = ({ onClick }) => (
    <button
        className="flex items-center gap-1 p-1 text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200"
        onClick={onClick}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
        </svg>
        <span className="text-xs font-medium">Attach the file</span>
    </button>
)

const FilePreviewItem: React.FC<{
    file: FilePreview
    index: number
    onRemove: (index: number) => void
}> = ({ file, index, onRemove }) => (
    <div className="relative group">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center">
            {file.file.type.startsWith("image/") ? (
                <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="text-xs text-center text-gray-500 dark:text-gray-400 p-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    {file.file.name.length > 10
                        ? `${file.file.name.substring(0, 7)}...`
                        : file.file.name}
                </div>
            )}
        </div>
        <button
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Remove file"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
            >
                <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                />
            </svg>
        </button>
    </div>
)

const DragOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 border-2 border-dashed border-blue-500">
        <div className="text-blue-600 dark:text-blue-400 font-medium flex flex-col items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                />
            </svg>
            Drop files here
        </div>
    </div>
)

// Main component
export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const {
        message,
        isDragging,
        attachedFiles,
        isExpanded,
        textareaRef,
        fileInputRef,
        setMessage,
        handleFileSelect,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        removeFile,
        handleSendMessage,
        handleKeyDown,
    } = useChatInput(onSendMessage)

    return (
        <div className="px-4 sm:px-8 md:px-16 py-4 mb-4 mx-auto w-full max-w-[850px] relative">
            {/* Glass effect around the input - only in light mode */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl border border-white/20 pointer-events-none dark:hidden"></div>
            <div
                className={`relative overflow-hidden transition-all duration-300 bg-gray-200 dark:bg-[#2A2A30] rounded-xl ${
                    isDragging
                        ? "ring-2 ring-[#2D7FF9] bg-blue-50 dark:bg-blue-900/20"
                        : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Input field section */}
                <div className="m-2 px-4 py-3 relative flex items-center rounded-xl bg-white dark:bg-[#1E1F25]">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 outline-none text-base py-1 my-auto resize-none overflow-y-auto placeholder-gray-400 dark:placeholder-gray-400"
                        rows={1}
                        style={{ minHeight: "24px", maxHeight: "150px" }}
                        aria-label="Message input"
                    />
                    {/* Send button */}
                    <SendButton
                        onClick={handleSendMessage}
                        disabled={!message.trim() && attachedFiles.length === 0}
                        isExpanded={isExpanded}
                    />
                </div>

                {/* Bottom section with tools and file previews */}
                <div className="bg-gray-200 dark:bg-[#2A2A30] rounded-b-xl transition-all duration-300">
                    {/* Tools bar */}
                    <div className="flex items-center justify-between px-4 py-2">
                        {/* Left aligned tools */}
                        <div className="flex items-center space-x-4">
                            {/* Model selector */}
                            <ModelSelector />

                            {/* File input (hidden) */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                multiple
                            />

                            {/* File icon with text */}
                            <FileAttachButton
                                onClick={() => fileInputRef.current?.click()}
                            />
                        </div>
                    </div>

                    {/* File preview section */}
                    {attachedFiles.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-300 dark:border-gray-700">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Attached files:
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {attachedFiles.map((file, index) => (
                                    <FilePreviewItem
                                        key={index}
                                        file={file}
                                        index={index}
                                        onRemove={removeFile}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drag overlay */}
                    {isDragging && <DragOverlay />}
                </div>
            </div>
        </div>
    )
}
