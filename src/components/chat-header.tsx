import React from 'react';

interface ChatHeaderProps {
  title: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ title }) => {
  return (
    <div className="h-14 flex items-center px-4 sm:px-6 border-b border-gray-200/10 dark:border-gray-700/20">
      <h2 className="text-lg font-medium truncate max-w-[calc(100vw-160px)]">{title}</h2>
    </div>
  );
}; 