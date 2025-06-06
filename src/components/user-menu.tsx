"use client"

import React, { useState } from 'react'
import { useAuth } from './auth-context'

export function UserMenu() {
  const { user, isLoading, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse"></div>
    )
  }

  if (!user) {
    return null // Don't show anything when not logged in, sign in button is now in sidebar
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.email}
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#27272A] rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg z-20">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </div>
            </div>
            
            <div className="py-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  // Add profile navigation here
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Profile Settings
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  // Add preferences navigation here
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Preferences
              </button>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 py-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  logout()
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 