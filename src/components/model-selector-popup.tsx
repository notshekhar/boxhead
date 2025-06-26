"use client"

import React from "react"
import { CommonPopup } from "@/components/common-popup"
import { getModelIcon } from "@/lib/utils"

interface Model {
    name: string
    displayName: string
    icon: string
    default?: boolean
}

interface ModelSelectorPopupProps {
    selectedModel: Model | null
    onModelSelect: (model: Model) => void
    isOpen: boolean
    onClose: () => void
    models: Model[]
}

export const ModelSelectorPopup: React.FC<ModelSelectorPopupProps> = React.memo(
    ({ selectedModel, onModelSelect, isOpen, onClose, models }) => {
        // Handle model selection
        const handleModelSelect = (model: Model) => {
            onModelSelect(model)
            onClose()
        }



        return (
            <CommonPopup
                isOpen={isOpen}
                onClose={onClose}
                title="Select Model"
                maxWidth="sm"
                className="max-h-80"
            >
                <div className="max-h-60 overflow-y-auto">
                    {models.length === 0 ? (
                        <div className="flex items-center justify-center py-6">
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No models available</p>
                        </div>
                    ) : (
                        <div className="p-1">
                            {models.map((model) => (
                                <button
                                    key={model.name}
                                    onClick={() => handleModelSelect(model)}
                                    className={`w-full flex items-center px-3 py-2 mx-1 my-0.5 rounded-lg transition-all duration-200 ${
                                        selectedModel?.name === model.name
                                            ? "bg-[#2D7FF9] text-white"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {/* Model icon */}
                                    <div className="w-4 h-4 mr-2.5 flex-shrink-0 flex items-center justify-center">
                                        <img
                                            src={getModelIcon(model.icon)}
                                            alt={`${model.icon} icon`}
                                            className="w-4 h-4 object-contain"
                                            onError={(e) => {
                                                // Fallback to a generic icon if specific icon fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/model-icons/default.svg";
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="font-medium text-sm truncate">
                                            {model.displayName}
                                        </div>
                                    </div>

                                    {/* Default badge */}
                                    {model.default && selectedModel?.name !== model.name && (
                                        <div className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 rounded flex-shrink-0 ml-2">
                                            Default
                                        </div>
                                    )}

                                    {/* Selected indicator */}
                                    {selectedModel?.name === model.name && (
                                        <svg
                                            className="w-4 h-4 ml-2 flex-shrink-0"
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
            </CommonPopup>
        )
    }
) 