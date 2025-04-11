import React from 'react';

type MessageType = 'user' | 'ai';

interface ChatMessageProps {
  content: string;
  type: MessageType;
}

// Typing animation component for AI messages
const TypingAnimation = () => (
  <div className="flex space-x-1.5 my-1 ml-1">
    <div className="w-2 h-2 rounded-full bg-accent-blue/70 dark:bg-accent-blue/50 animate-pulse" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-accent-blue/70 dark:bg-accent-blue/50 animate-pulse" style={{ animationDelay: '300ms' }}></div>
    <div className="w-2 h-2 rounded-full bg-accent-blue/70 dark:bg-accent-blue/50 animate-pulse" style={{ animationDelay: '600ms' }}></div>
  </div>
);

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, type }) => {
  // User message component
  if (type === 'user') {
    return (
      <div className="flex justify-end mb-6 items-end">
        {/* Message bubble */}
        <div className="max-w-[80%] bg-white dark:bg-gray-darker rounded-xl py-3 px-4 border border-gray-light dark:border-gray-dark mr-2">
          <p className="text-sm text-text-light dark:text-text-dark">{content}</p>
        </div>
      </div>
    );
  }
  // AI message component
  else {
    return (
      <div className="flex mb-6 items-start">
        {/* AI avatar */}
        <div className="flex-shrink-0 mr-3 w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2D7FF9] font-bold border border-[#2D7FF9]/20">
          <span className="font-bold text-sm">AI</span>
        </div>

        {/* Message bubble - no border */}
        <div className="max-w-[85%] px-1">
          <p className="text-sm text-text-light dark:text-text-dark whitespace-pre-wrap leading-relaxed">{content}</p>

          {/* Uncomment this to show typing animation when needed */}
          {/* <TypingAnimation /> */}
        </div>
      </div>
    );
  }
};