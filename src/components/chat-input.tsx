import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useModels } from "./models-context"
import { useChatContext } from "./chat-context"
import { useRouter } from "next/navigation"
import { getModelIcon } from "@/lib/utils"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"

interface ChatInputProps {
    onSendMessage: () => void
    input: string
    setInput: (input: string) => void
    isLoading?: boolean
}

interface FilePreview {
    file: File
    preview: string
    isRemoving?: boolean
}

// Custom hook for chat input logic
function useChatInput(
    onSendMessage: (message: string, files?: File[]) => void,
    input: string,
    setInput: (input: string) => void
) {
    // State
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
    }, [input])

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            attachedFiles.forEach((file) => URL.revokeObjectURL(file.preview))
        }
    }, [attachedFiles])

    // File handling methods
    const handleFiles = (files: File[]) => {
        // Process files one by one with a slight delay for staggered animation
        Array.from(files).forEach((file, index) => {
            setTimeout(() => {
                const preview = URL.createObjectURL(file)
                setAttachedFiles((prev) => [...prev, { file, preview }])
            }, index * 80) // Stagger the appearance of each file
        })
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFiles(Array.from(event.target.files))
        }
    }

    const removeFile = (index: number) => {
        // Mark the file as being removed in the state
        // This approach avoids direct DOM manipulation which can cause glitches
        setAttachedFiles((prev) => {
            const newFiles = prev.map((file, i) => {
                if (i === index) {
                    // Mark this file for removal animation
                    return { ...file, isRemoving: true }
                }
                return file
            })
            return newFiles
        })

        // After animation completes, actually remove the file
        setTimeout(() => {
            setAttachedFiles((prev) => {
                // Filter out the file that was marked for removal
                const newFiles = prev.filter((file, i) => {
                    if (i === index) {
                        // Clean up the object URL before removing
                        URL.revokeObjectURL(file.preview)
                        return false // Remove this file
                    }
                    return true // Keep other files
                })
                return newFiles
            })
        }, 350) // Match with animation duration
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
        if (input.trim() || attachedFiles.length > 0) {
            onSendMessage(
                input,
                attachedFiles.map((f) => f.file)
            )
            setInput("")
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
        isDragging,
        attachedFiles,
        isExpanded,

        // Refs
        textareaRef,
        fileInputRef,

        // Handlers
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
}> = React.memo(({ onClick, disabled, isExpanded = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 bg-[#2D7FF9] text-white rounded-lg transition-all duration-200 cursor-pointer ${
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
))

interface Model {
    name: string
    displayName: string
    icon: string
    default?: boolean
}



const IncognitoButton: React.FC<{
    isIncognito: boolean
    onClick: () => void
}> = React.memo(({ isIncognito, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 cursor-pointer text-xs font-medium${
            isIncognito
                ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 hover:bg-orange-100 dark:hover:bg-orange-500/20"
            : "text-gray-700 dark:text-white bg-gray-200 dark:bg-[#2A2A30] border-gray-200 dark:border-gray-600"
        }`}
        aria-label="Toggle incognito mode"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M17.5,11.75 C20.1233526,11.75 22.25,13.8766474 22.25,16.5 C22.25,19.1233526 20.1233526,21.25 17.5,21.25 C15.4019872,21.25 13.6216629,19.8898135 12.9927596,18.0031729 L11.0072404,18.0031729 C10.3783371,19.8898135 8.59801283,21.25 6.5,21.25 C3.87664744,21.25 1.75,19.1233526 1.75,16.5 C1.75,13.8766474 3.87664744,11.75 6.5,11.75 C8.9545808,11.75 10.9743111,13.6118164 11.224028,16.0002862 L12.775972,16.0002862 C13.0256889,13.6118164 15.0454192,11.75 17.5,11.75 Z M6.5,13.75 C4.98121694,13.75 3.75,14.9812169 3.75,16.5 C3.75,18.0187831 4.98121694,19.25 6.5,19.25 C8.01878306,19.25 9.25,18.0187831 9.25,16.5 C9.25,14.9812169 8.01878306,13.75 6.5,13.75 Z M17.5,13.75 C15.9812169,13.75 14.75,14.9812169 14.75,16.5 C14.75,18.0187831 15.9812169,19.25 17.5,19.25 C19.0187831,19.25 20.25,18.0187831 20.25,16.5 C20.25,14.9812169 19.0187831,13.75 17.5,13.75 Z M15.5119387,3 C16.7263613,3 17.7969992,3.79658742 18.145961,4.95979331 L19.1520701,8.31093387 C19.944619,8.44284508 20.7202794,8.59805108 21.4790393,8.77658283 C22.0166428,8.90307776 22.3499121,9.44143588 22.2234172,9.9790393 C22.0969222,10.5166428 21.5585641,10.8499121 21.0209607,10.7234172 C18.2654221,10.0750551 15.258662,9.75 12,9.75 C8.74133802,9.75 5.73457794,10.0750551 2.97903933,10.7234172 C2.44143588,10.8499121 1.90307776,10.5166428 1.77658283,9.9790393 C1.6500879,9.44143588 1.98335721,8.90307776 2.52096067,8.77658283 C3.27940206,8.59812603 4.05472975,8.4429754 4.8469317,8.31110002 L5.85403902,4.95979331 C6.20300079,3.79658742 7.2736387,3 8.4880613,3 L15.5119387,3 Z" />
        </svg>
        <span className="whitespace-nowrap">Incognito</span>
    </button>
))

const FileAttachButton: React.FC<{
    onClick: () => void
}> = React.memo(({ onClick }) => (
    <button
        className="flex items-center gap-1 p-1 text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200 cursor-pointer"
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
))

const FilePreviewItem: React.FC<{
    file: FilePreview
    index: number
    onRemove: (index: number) => void
}> = React.memo(({ file, index, onRemove }) => {
    // Animation delay based on index for staggered appearance
    const animationDelay = `${index * 100}ms`

    // Determine which animation class to use based on file state
    const animationClass = file.isRemoving
        ? "animate-scale-out"
        : "animate-scale-in"

    return (
        <div
            className={`relative group ${animationClass}`}
            style={{
                animationDelay,
                animationFillMode: "both",
                animationDuration: file.isRemoving ? "350ms" : "400ms",
            }}
        >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 flex items-center justify-center transition-all duration-300 hover:shadow-md hover:scale-105">
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
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 cursor-pointer"
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
})

const DragOverlay: React.FC = React.memo(() => (
    <div
        className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 border-2 border-dashed border-blue-500"
        style={{
            animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
    >
        <div
            className="text-blue-600 dark:text-blue-400 font-medium flex flex-col items-center"
            style={{
                animation: "float 3s ease-in-out infinite",
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
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
))

const ModelSelectedDisplay: React.FC<{ option?: ComboboxOption | null }> = React.memo(({ option }) => (
    <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center cursor-pointer">
            <img
                src={getModelIcon(option?.icon || "")}
                alt={`${option?.icon || "default"} icon`}
                className="w-4 h-4 object-contain transition-all duration-200 model-icon cursor-pointer"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/model-icons/default.svg";
                }}
            />
        </div>
        <span className="whitespace-nowrap cursor-pointer">{option?.label}</span>
    </div>
))

const ModelOptionDisplay: React.FC<{ option: ComboboxOption }> = React.memo(({ option }) => (
    <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-4 h-4 flex items-center justify-center cursor-pointer">
            <img
                src={getModelIcon(option.icon || "")}
                alt={`${option.icon || "default"} icon`}
                className="w-4 h-4 object-contain cursor-pointer"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/model-icons/default.svg";
                }}
            />
        </div>
        <span className="cursor-pointer">{option.label}</span>
    </div>
))

// Main component
export const ChatInput: React.FC<ChatInputProps> = React.memo(
    ({ onSendMessage, input, setInput, isLoading = false }) => {
        const { models, selectedModel, setSelectedModel } = useModels()
        const { incognito, setIncognito } = useChatContext()
        const router = useRouter()

        const {
            isDragging,
            attachedFiles,
            isExpanded,
            textareaRef,
            fileInputRef,
            handleFileSelect,
            handleDragOver,
            handleDragLeave,
            handleDrop,
            removeFile,
            handleSendMessage,
            handleKeyDown,
        } = useChatInput(onSendMessage, input, setInput)

        const handleIncognito = useCallback(() => {
            router.push(`/?incognito=${!incognito}`)
        }, [incognito, router])

        // Transform models into combobox options
        const modelOptions: ComboboxOption[] = useMemo(() => {
            return models.map(model => ({
                value: model.name,
                label: model.displayName,
                icon: model.icon
            }))
        }, [models])

        const handleModelChange = useCallback((modelName: string) => {
            const model = models.find(m => m.name === modelName)
            if (model) {
                setSelectedModel(model)
            }
        }, [models, setSelectedModel])

        return (
            <div className="z-50 px-3 sm:px-4 md:px-8 lg:px-16 py-4 mb-4 mx-auto w-full max-w-[850px] relative">

                <div
                    className={`relative overflow-hidden transition-all duration-300 bg-gray-200 dark:bg-[#2A2A30] rounded-xl ${
                        isDragging
                            ? "ring-2 ring-[#2D7FF9] bg-blue-50 dark:bg-blue-900/20 shadow-glow-blue"
                            : incognito
                            ? "ring-2 ring-orange-500"
                            : ""
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* Input field section */}
                    <div className="m-2 px-4 py-3 relative flex items-center rounded-lg bg-white dark:bg-[#1E1F25]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything"
                            className="flex-1 bg-transparent border-0 focus:ring-0 outline-none text-base py-1 my-auto resize-none overflow-y-auto placeholder-gray-400 dark:placeholder-gray-400"
                            rows={1}
                            style={{ minHeight: "24px", maxHeight: "150px" }}
                            aria-label="Message input"
                        />
                        {/* Send button */}
                        <SendButton
                            onClick={handleSendMessage}
                            disabled={
                                !(input.trim() || attachedFiles.length > 0) ||
                                isLoading
                            }
                            isExpanded={isExpanded}
                        />
                    </div>

                    {/* Bottom section with tools and file previews */}
                    <div className="bg-gray-200 dark:bg-[#2A2A30] rounded-b-xl transition-all duration-300 overflow-hidden">
                        {/* Tools bar */}
                        <div className="flex items-center justify-between px-4 py-2">
                            {/* Left aligned tools */}
                            <div className="flex items-center space-x-4">
                                {/* Model selector */}
                                <Combobox
                                    options={modelOptions}
                                    value={selectedModel?.name}
                                    onValueChange={handleModelChange}
                                    placeholder="Select Model"
                                    searchPlaceholder="Search models..."
                                    emptyText="No models found"
                                    renderSelected={(option) => <ModelSelectedDisplay option={option} />}
                                    renderOption={(option) => <ModelOptionDisplay option={option} />}
                                />

                                {/* File input (hidden) */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    multiple
                                />

                                {/* TODO: File icon with text - not working */}
                                {/* <FileAttachButton
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                /> */}
                            </div>
                            <div className="flex items-center">
                                <IncognitoButton
                                    isIncognito={incognito}
                                    onClick={handleIncognito}
                                />
                            </div>
                        </div>

                        {/* File preview section - only render when there are files */}
                        {attachedFiles.length > 0 && (
                            <div
                                className="px-4 py-3 border-t border-gray-300 dark:border-gray-700 transition-all animate-scale-in"
                                style={{
                                    transformOrigin: "top center",
                                    animationDuration: "0.3s",
                                }}
                            >
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
)
