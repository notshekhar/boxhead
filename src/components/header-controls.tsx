import React from 'react';

interface HeaderControlsProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ onToggleSidebar, onNewChat }) => {
  return (
    <div className="h-14 flex items-center gap-3 px-4 border-b border-gray-200/10 dark:border-gray-700/20">
      <div className="flex items-center gap-2 rounded-lg">
        <button 
          onClick={onToggleSidebar}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button 
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-colors"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          onClick={onNewChat}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/30 dark:hover:bg-gray-700/30 transition-colors"
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