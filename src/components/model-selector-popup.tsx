"use client"

import React, { useState, useMemo } from "react"
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
        const [searchQuery, setSearchQuery] = useState("")

        // Filter models
        const filteredModels = useMemo(() => {
            return models.filter(model =>
                model.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                model.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }, [models, searchQuery])

        // Handle model selection
        const handleModelSelect = (model: Model) => {
            onModelSelect(model)
            onClose()
        }

        return (
            <CommonPopup
                isOpen={isOpen}
                onClose={onClose}
                title="Model Selector"
                maxWidth="md"
                className="max-h-[32rem]"
            >
                <div className="space-y-4 p-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-4 w-4 text-gray-400 dark:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search models..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1F25] border border-gray-200 dark:border-gray-700/30 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D7FF9] focus:border-transparent transition-all duration-200"
                        />
                    </div>



                    {/* Models List */}
                    <div className="max-h-96 overflow-y-auto">
                        {filteredModels.length === 0 ? (
                            <div className="flex items-center justify-center py-8">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {searchQuery ? 'No models found' : 'No models available'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1 pr-2">
                                {filteredModels.map((model) => (
                                    <button
                                        key={model.name}
                                        onClick={() => handleModelSelect(model)}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                            selectedModel?.name === model.name
                                                ? "bg-[#2D7FF9] text-white"
                                                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    >
                                        {/* Model icon */}
                                        <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                                            <img
                                                src={getModelIcon(model.icon)}
                                                alt={`${model.icon} icon`}
                                                className="w-5 h-5 object-contain"
                                                onError={(e) => {
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
                </div>
            </CommonPopup>
        )
    }
) 