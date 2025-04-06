import React, { useState, useRef, useEffect } from 'react';
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
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  chats, 
  onNewChat, 
  onSelectChat, 
  onToggleSidebar,
  isOpen = true
}) => {
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        setShowSearchPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showSearchPopup && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchPopup]);

  const handleSearchClick = () => {
    setShowSearchPopup(true);
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
      className={`flex flex-col border-r border-gray-200/10 dark:border-gray-700/20 bg-gray-light/50 dark:bg-gray-dark/50 transition-all duration-300 ease-in-out ${isOpen ? 'w-[220px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden'}`}
    >
      {/* App title with sidebar toggle */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200/10 dark:border-gray-700/20">
        <h1 className="text-lg font-semibold whitespace-nowrap">cursor.chat</h1>
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform hover:scale-110 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* New Chat button */}
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-secondary-light dark:bg-secondary-dark text-white rounded-md transition-all duration-200 hover:bg-opacity-90 active:scale-[0.98] text-sm font-medium whitespace-nowrap"
        >
          New Chat
        </button>
      </div>

      {/* Search input */}
      <div className="px-3 py-2 relative">
        <div className="relative">
          <div 
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
            onClick={handleSearchClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-transparent border border-gray-300/10 dark:border-gray-700/30 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-secondary-light dark:focus:ring-secondary-dark cursor-pointer transition-all duration-200"
            placeholder="Search your threads..."
            onClick={handleSearchClick}
            readOnly
          />
        </div>

        {/* Search Popup */}
        {showSearchPopup && (
          <div 
            ref={searchPopupRef} 
            className="absolute top-0 left-0 right-0 z-10 bg-primary-light dark:bg-primary-dark rounded-md border border-gray-200/20 dark:border-gray-700/20 mt-2 overflow-hidden max-h-[500px] w-[400px] animate-fadeIn"
            style={{ 
              transform: 'translateX(-10%)', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              animation: 'fadeIn 0.2s ease-out forwards'
            }}
          >
            <div className="flex items-center p-3 border-b border-gray-200/10 dark:border-gray-700/20">
              <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-10 pr-3 py-2 bg-transparent border-none text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                placeholder="Search or press Enter to start new chat..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none text-gray-400 text-xs">
                /
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Recent Chats</span>
              </div>
              
              <div className="space-y-1">
                {recentChats.map((chat, index) => (
                  <button 
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id);
                      setShowSearchPopup(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200/30 dark:hover:bg-gray-800/30 transition-all duration-200 text-sm animate-slideIn"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideIn 0.2s ease-out forwards'
                    }}
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 px-3 py-2">Today</h2>
          <div className="mt-1">
            {chats.map((chat, index) => (
              <button 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-200/30 dark:hover:bg-gray-800/30 transition-all duration-200 text-sm flex items-center animate-fadeIn whitespace-nowrap"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeIn 0.2s ease-out forwards'
                }}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User profile */}
      <div className="p-3 border-t border-gray-200/10 dark:border-gray-700/20 flex items-center">
        <Link href="/settings" className="flex items-center w-full hover:bg-gray-200/30 dark:hover:bg-gray-800/30 rounded-md p-2 transition-all duration-200 group">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden mr-3 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 transform group-hover:scale-105 transition-transform duration-200">
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