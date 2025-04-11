import React, { useRef, useEffect } from 'react';

interface ChatItem {
  id: string;
  title: string;
}

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  recentChats: ChatItem[];
}

export const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
  onSelectChat,
  recentChats
}) => {
  const searchPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchPopupRef.current && !searchPopupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-md" onClick={onClose}></div>

      {/* Search modal */}
      <div
        ref={searchPopupRef}
        className="relative bg-white/90 dark:bg-[#1E1F25]/90 backdrop-blur-sm rounded-xl border-0 overflow-hidden max-h-[500px] w-[90%] max-w-[500px] shadow-lg"
        style={{
          animation: 'fadeIn 0.3s ease-out forwards'
        }}
      >
        <div className="p-3 border-b border-gray-200/5 dark:border-gray-700/5">
          <div className="flex items-center gap-2 bg-transparent dark:bg-transparent border-0 rounded-lg px-2 py-1">
            <div className="flex items-center gap-2 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <span className="text-base font-normal text-gray-500 dark:text-gray-400 flex-shrink-0">/</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="flex-1 bg-transparent border-0 outline-none text-sm placeholder-gray-400 dark:placeholder-gray-400 focus:ring-0 py-0.5"
              placeholder="Search or press Enter to start new chat..."
            />
          </div>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Recent Chats</span>
          </div>

          <div className="space-y-1">
            {recentChats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose();
                }}
                className="w-full text-left px-2 py-2.5 hover:bg-gray-100/10 dark:hover:bg-gray-800/20 transition-all duration-200 text-sm animate-slideIn"
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
    </div>
  );
};
