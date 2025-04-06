import React from 'react';

type MessageType = 'user' | 'ai';

interface ChatMessageProps {
  content: string;
  type: MessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, type }) => {
  if (type === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] bg-gray-200/50 dark:bg-gray-800/50 rounded-lg py-3 px-4">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex mb-4">
        <div className="max-w-full bg-gray-100/50 dark:bg-gray-700/50 rounded-lg py-3 px-4">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  }
}; 