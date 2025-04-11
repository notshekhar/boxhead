import React from 'react';

interface HeaderControlsProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onOpenSearch?: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ onToggleSidebar, onNewChat, onOpenSearch }) => {
  return (
    <div className="bg-white dark:bg-[#27272A] rounded-xl border border-gray-100 dark:border-gray-700 px-2 py-1.5">
      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleSidebar}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={onOpenSearch}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          className="p-1 text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200"
          aria-label="New chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};