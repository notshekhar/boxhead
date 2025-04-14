import React, { useState, useEffect } from 'react';

interface EmptyStateProps {
  username?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ username = 'there' }) => {
  const displayName = username === 'there' ? 'there' : username;

  // State to control animation
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 max-w-md mx-auto relative">
      {/* Glass effect around the content - only in light mode */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl border border-white/20 pointer-events-none dark:hidden"></div>

      <div className={`w-full space-y-3 mb-10 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <h3 className="text-gray-500 dark:text-gray-400 text-xl font-normal">
          Hi {displayName},
        </h3>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back! How can I help?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">
          I'm here to help you tackle your tasks. Choose from the prompts below or just tell me what you need!
        </p>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4 ${isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '100ms' }}>
        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">Create image</span>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">Analyze data</span>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">Make a plan</span>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-violet-600 bg-violet-100 dark:bg-violet-900/30 dark:text-violet-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">Summarize text</span>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">Help me write</span>
        </button>

        <button className="flex items-center gap-3 p-4 bg-white dark:bg-[#1E1F25] rounded-xl border border-gray-200 dark:border-gray-700/30 text-left hover:bg-gray-50 dark:hover:bg-[#2A2A30] transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 text-gray-600 bg-gray-100 dark:bg-gray-700/50 dark:text-gray-400 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-800 dark:text-white">More</span>
        </button>
      </div>

      {/* Add animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-scale-in {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};