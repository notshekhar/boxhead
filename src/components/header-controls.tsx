import React from 'react';

interface HeaderControlsProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({ onToggleSidebar, onNewChat }) => {
  return (
    <div className="h-14 flex items-center gap-3 px-4 border-b border-white/10 dark:border-gray-700/20 bg-white/50 dark:bg-gray-dark/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-lg">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-accent-blue dark:hover:text-accent-blue hover:bg-white/50 dark:hover:bg-gray-darker/50 transition-all duration-300 border border-white/10 dark:border-gray-700/30"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          className="p-1.5 rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-accent-blue dark:hover:text-accent-blue hover:bg-white/50 dark:hover:bg-gray-darker/50 transition-all duration-300 border border-white/10 dark:border-gray-700/30"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          className="p-1.5 rounded-full text-white bg-gradient-to-r from-gradient-start to-gradient-end hover:shadow-glow-red transition-all duration-300 transform hover:scale-105 active:scale-95"
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