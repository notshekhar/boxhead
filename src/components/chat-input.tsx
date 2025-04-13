import React, { useState, useRef, useEffect, DragEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="px-4 sm:px-8 md:px-16 py-4 mb-4 mx-auto w-full max-w-[850px] relative">
      {/* Glass effect around the input - only in light mode */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl border border-white/20 pointer-events-none dark:hidden"></div>
      <div className="relative overflow-hidden transition-all duration-300 bg-gray-200 dark:bg-[#2A2A30] rounded-xl">
        {/* Input field section */}
        <div className="m-2 px-4 py-3 relative flex rounded-xl bg-white dark:bg-[#1E1F25]">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="flex-1 bg-transparent border-0 focus:ring-0 outline-none text-base py-1 resize-none overflow-y-auto placeholder-gray-400 dark:placeholder-gray-400"
            rows={1}
            style={{ minHeight: '24px', maxHeight: '150px' }}
            aria-label="Message input"
          />
          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 bg-[#2D7FF9] text-white rounded-lg transition-all duration-200 ml-2 self-start mt-1 ${!message.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom bar with buttons */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-[#2A2A30] rounded-b-xl">
          {/* Left aligned tools */}
          <div className="flex items-center space-x-4">
            {/* Model selector */}
            <button className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2D7FF9] mr-1.5"></div>
              <span>UUI v6.0</span>
            </button>

            {/* File icon with text */}
            <button className="flex items-center gap-1 p-1 text-gray-500 dark:text-gray-400 hover:text-[#2D7FF9] dark:hover:text-[#2D7FF9] transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="text-xs font-medium">Attach the file</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};