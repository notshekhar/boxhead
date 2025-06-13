"use client"

import React, { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface CommonPopupProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: "sm" | "md" | "lg" | "xl"
    showCloseButton?: boolean
    closeOnBackdropClick?: boolean
    className?: string
}

export const CommonPopup: React.FC<CommonPopupProps> = React.memo(
    ({
        isOpen,
        onClose,
        title,
        children,
        maxWidth = "md",
        showCloseButton = true,
        closeOnBackdropClick = true,
        className = "",
    }) => {
        const popupRef = useRef<HTMLDivElement>(null)
        const [mounted, setMounted] = React.useState(false)

        // Ensure component is mounted on client side
        useEffect(() => {
            setMounted(true)
        }, [])

        // Close popup when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    closeOnBackdropClick &&
                    popupRef.current &&
                    !popupRef.current.contains(event.target as Node)
                ) {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener("mousedown", handleClickOutside)
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside)
                }
            }
        }, [isOpen, onClose, closeOnBackdropClick])

        // Handle escape key
        useEffect(() => {
            const handleEscapeKey = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    onClose()
                }
            }

            if (isOpen) {
                document.addEventListener("keydown", handleEscapeKey)
                return () => {
                    document.removeEventListener("keydown", handleEscapeKey)
                }
            }
        }, [isOpen, onClose])

        if (!isOpen || !mounted) return null

        const maxWidthClasses = {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-lg",
            xl: "max-w-xl",
        }

        const modalContent = (
            <>
                {/* Backdrop */}
                <div 
                    className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[99998]"
                    onClick={closeOnBackdropClick ? onClose : undefined}
                />
                
                {/* Popup Container */}
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
                    <div
                        ref={popupRef}
                        className={`relative bg-white dark:bg-[#1E1F25] shadow-xl border border-gray-200 dark:border-gray-700 w-full ${maxWidthClasses[maxWidth]} overflow-hidden animate-scale-in pointer-events-auto ${className}`}
                        style={{
                            animationDuration: "0.2s",
                            transformOrigin: "center center",
                        }}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    {title && (
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                            {title}
                                        </h3>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-auto"
                                        >
                                            <svg
                                                className="w-4 h-4"
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
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        )

        return createPortal(modalContent, document.body)
    }
)

CommonPopup.displayName = "CommonPopup" 