"use client"

import React, { useEffect, useRef } from "react"

interface Model {
    name: string
    provider: string
    default?: boolean
}

interface ModelSelectorPopupProps {
    selectedModel: string
    onModelSelect: (model: string) => void
    isOpen: boolean
    onClose: () => void
    models: Model[]
}

export const ModelSelectorPopup: React.FC<ModelSelectorPopupProps> = React.memo(
    ({ selectedModel, onModelSelect, isOpen, onClose, models }) => {
        const popupRef = useRef<HTMLDivElement>(null)

        // Close popup when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside)
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside)
                }
            }
        }, [isOpen, onClose])

        // Handle model selection
        const handleModelSelect = (modelName: string) => {
            onModelSelect(modelName)
            onClose()
        }

        // Get provider color
        const getProviderColor = (provider: string) => {
            switch (provider) {
                case "google":
                    return "bg-blue-500"
                case "openai":
                    return "bg-green-500"
                case "anthropic":
                    return "bg-orange-500"
                default:
                    return "bg-gray-500"
            }
        }

        // Get display name for model
        const getModelDisplayName = (name: string) => {
            return name.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        }

        if (!isOpen) return null

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                {/* Popup */}
                <div
                    ref={popupRef}
                    className="relative bg-white dark:bg-[#1E1F25] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md mx-4 max-h-96 overflow-hidden animate-scale-in"
                    style={{
                        animationDuration: "0.2s",
                        transformOrigin: "center center",
                    }}
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Select Model
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-80 overflow-y-auto">
                        {models.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">No models available</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {models.map((model) => (
                                    <button
                                        key={model.name}
                                        onClick={() => handleModelSelect(model.name)}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                            selectedModel === model.name
                                                ? "bg-[#2D7FF9] text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {/* Provider indicator */}
                                        <div
                                            className={`w-3 h-3 rounded-full mr-3 ${
                                                selectedModel === model.name
                                                    ? "bg-white"
                                                    : getProviderColor(model.provider)
                                            }`}
                                        />
                                        
                                        <div className="flex-1 text-left">
                                            <div className="font-medium">
                                                {getModelDisplayName(model.name)}
                                            </div>
                                            <div
                                                className={`text-sm capitalize ${
                                                    selectedModel === model.name
                                                        ? "text-white/70"
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                {model.provider}
                                            </div>
                                        </div>

                                        {/* Default badge */}
                                        {model.default && selectedModel !== model.name && (
                                            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 rounded">
                                                Default
                                            </div>
                                        )}

                                        {/* Selected indicator */}
                                        {selectedModel === model.name && (
                                            <svg
                                                className="w-5 h-5 ml-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
) 