import React from 'react';

interface SidebarToggleProps {
  onToggleSidebar: () => void;
}

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ onToggleSidebar }) => {
  return (
    <div className="fixed top-4 left-[260px] z-40">
      <button
        onClick={onToggleSidebar}
        className="bg-white dark:bg-[#27272A] rounded-full border border-gray-100 dark:border-gray-700 p-1 text-gray-600 dark:text-gray-300 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200 shadow-sm translate-x-[-50%] cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {/* Document/page icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <line x1="9" y1="3" x2="9" y2="21" />
        </svg>
      </button>
    </div>
  );
};
