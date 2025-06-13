"use client"

import React, { useState } from "react"
import { CommonPopup } from "@/components/common-popup"

// Example of how to use the CommonPopup for different scenarios
export const PopupExamples: React.FC = () => {
    const [showConfirm, setShowConfirm] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">CommonPopup Examples</h2>
            
            {/* Example buttons */}
            <div className="flex gap-4">
                <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Show Confirmation
                </button>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Show Form
                </button>
                <button
                    onClick={() => setShowInfo(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Show Info
                </button>
            </div>

            {/* Confirmation Dialog */}
            <CommonPopup
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirm Action"
                maxWidth="sm"
                showCloseButton={false}
            >
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Are you sure you want to perform this action?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </CommonPopup>

            {/* Form Dialog */}
            <CommonPopup
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title="Create New Item"
                maxWidth="lg"
            >
                <form className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                            placeholder="Enter name..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                            rows={3}
                            placeholder="Enter description..."
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </CommonPopup>

            {/* Info Dialog (no header) */}
            <CommonPopup
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                maxWidth="md"
                showCloseButton={true}
            >
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Success!</h3>
                            <p className="text-gray-600 dark:text-gray-400">Your action has been completed successfully.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInfo(false)}
                        className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                        Got it
                    </button>
                </div>
            </CommonPopup>
        </div>
    )
} 