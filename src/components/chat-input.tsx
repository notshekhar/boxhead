import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150); // Max height of 150px
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 py-4 mb-4 mx-auto w-full max-w-[850px]">
      <div className="overflow-hidden border border-gray-300/80 dark:border-gray-700/40 rounded-lg">
        {/* Input field - lighter background */}
        <div className="px-4 py-3 relative bg-primary-light dark:bg-primary-dark">
          <div className="relative">
            <div className="pr-10">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="w-full bg-transparent border-0 focus:ring-0 outline-none text-base py-1 resize-none overflow-y-auto"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '150px' }}
                aria-label="Message input"
              />
            </div>
            
            {/* Send button - positioned absolutely to remain fixed at initial vertical center */}
            <div className="absolute right-0 top-0 h-[38px] flex items-center">
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-1.5 bg-secondary-light dark:bg-secondary-dark text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 ${!message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar with model selector and buttons - darker background */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200/60 dark:border-gray-700/40 bg-gray-light dark:bg-gray-dark">
          {/* Version selector */}
          <div className="flex items-center gap-1">
            <button className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              <span className="font-medium">UUI v6.0</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Shortcuts button */}
            <button 
              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Shortcuts"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h1m4 0h1m-7 4h1m4 0h1m-7 4h6" />
              </svg>
              <span className="text-sm font-medium">Shortcuts</span>
            </button>

            {/* Attach button */}
            <button 
              className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
              aria-label="Attach file"
              aria-expanded={isAttachMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-sm font-medium">Attach</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 