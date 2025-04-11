import React from 'react';
import Link from 'next/link';

interface ChatItem {
  id: string;
  title: string;
}

interface SidebarProps {
  chats: ChatItem[];
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onToggleSidebar: () => void;
  onOpenSearch?: () => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onNewChat,
  onSelectChat,
  onToggleSidebar,
  onOpenSearch,
  isOpen = true
}) => {


  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const recentChats = [
    { id: '1', title: 'Generate Image' },
    { id: '2', title: 'New Thread' },
    { id: '3', title: 'Greeting' },
    { id: '4', title: 'Snake game in HTML, CSS, and JS' },
    { id: '5', title: 'Snake game in HTML, CSS, and JS' },
    { id: '6', title: 'Setup Next.js app' },
  ];

  return (
    <div
      className={`flex flex-col border-r border-gray-light dark:border-gray-700/30 bg-white dark:bg-[#1E1F25] transition-all duration-300 ease-in-out ${isOpen ? 'w-[260px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden'}`}
    >
      {/* App title with sidebar toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-light dark:border-gray-700/30">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2D7FF9] mr-2 border border-[#2D7FF9]/20">
            <span className="font-bold text-sm">AI</span>
          </div>
          <h1 className="text-lg font-semibold whitespace-nowrap text-gray-800 dark:text-white">cursor.chat</h1>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* New Chat button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full py-2.5 px-4 bg-[#2D7FF9] text-white rounded-lg transition-all duration-200 active:scale-[0.98] text-sm font-medium whitespace-nowrap flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Search input */}
      <div className="px-4 py-2 relative">
        <div className="relative">
          <div className="flex items-center bg-white dark:bg-[#2A2B36] border border-gray-light dark:border-gray-700/30 rounded-lg px-2 py-1.5 cursor-pointer" onClick={handleSearchClick}>
            <div className="flex items-center gap-1 mr-1 self-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0 mx-0.5">/</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent border-0 outline-none text-xs placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 cursor-pointer"
              placeholder="Search your threads..."
              onClick={handleSearchClick}
              readOnly
            />
          </div>
        </div>


      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted-light/70 dark:text-text-muted-dark/70 px-2 py-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Today
          </h2>
          <div className="mt-1 space-y-1">
            {chats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2B36] transition-all duration-200 text-sm flex items-center animate-fadeIn whitespace-nowrap group"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.2s ease-out forwards'
                }}
              >
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center mr-2 text-[#2D7FF9] border border-[#2D7FF9]/20 group-hover:text-[#2D7FF9] transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="group-hover:text-[#2D7FF9] transition-colors duration-200">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-gray-light dark:border-gray-700/30 flex items-center">
        <Link href="/settings" className="flex items-center w-full hover:bg-gray-100 dark:hover:bg-[#2A2B36] rounded-lg p-2 transition-all duration-200 group">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#2A2B36] overflow-hidden mr-3 flex items-center justify-center text-sm font-medium text-[#2D7FF9] dark:text-[#2D7FF9] border border-[#2D7FF9]/20 dark:border-[#2D7FF9]/20">
            NS
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium whitespace-nowrap">notshekhar</p>
            <p className="text-xs text-gray-500">Pro</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 transform group-hover:rotate-45 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};