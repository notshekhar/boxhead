"use client";

import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { Sidebar } from "@/components/sidebar";
import { ChatHeader } from "@/components/chat-header";
import { EmptyState } from "@/components/empty-state";
import { HeaderControls } from "@/components/header-controls";
import { useState } from "react";
import { SearchPopup } from "@/components/search-popup";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Generate Image",
      messages: [
        {
          id: "1",
          content: "can you generate image?",
          type: "user",
        },
        {
          id: "2",
          content: "No, I cannot directly generate images. However, I can help you create descriptions, ideas, or instructions for generating images using tools like DALL-E, MidJourney, or other image-generation platforms. If you need assistance with designing or describing an image, feel free to ask!",
          type: "ai",
        },
      ],
    },
  ]);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [showSearchPopup, setShowSearchPopup] = useState<boolean>(false);

  // Recent chats for search popup
  const recentChats = [
    { id: '1', title: 'Generate Image' },
    { id: '2', title: 'New Thread' },
    { id: '3', title: 'Greeting' },
    { id: '4', title: 'Snake game in HTML, CSS, and JS' },
    { id: '5', title: 'Setup Next.js app' },
  ];

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleSendMessage = (message: string) => {
    // Find the current active chat
    const currentChat = chats.find((chat) => chat.id === activeChat);
    if (!currentChat) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: "user",
    };

    // In a real app, here you'd make an API call to get the AI response
    // For now we'll simulate it
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "This is a simulated AI response. In a real app, you would make an API call to get the response.",
      type: "ai",
    };

    // Update the chat with new messages
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage, aiMessage],
          // If it's the first message, update the chat title
          title: chat.messages.length === 0 ? message.substring(0, 20) : chat.title,
        };
      }
      return chat;
    });

    setChats(updatedChats);
  };

  // Get the current active chat
  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F1F3] dark:bg-[#17171F] text-text-light dark:text-text-dark relative">
      {/* Search Popup */}
      <SearchPopup
        isOpen={showSearchPopup}
        onClose={() => setShowSearchPopup(false)}
        onSelectChat={handleSelectChat}
        recentChats={recentChats}
      />

      {/* Sidebar - rendered conditionally based on sidebarVisible state */}
      {sidebarVisible && (
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onToggleSidebar={handleToggleSidebar}
          onOpenSearch={() => setShowSearchPopup(true)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col backdrop-blur-[2px] z-10">
        {/* Header area - show either HeaderControls or ChatHeader */}
        {!sidebarVisible ? (
          <div className="relative">
            <HeaderControls
              onToggleSidebar={handleToggleSidebar}
              onNewChat={handleNewChat}
            />
            <div className="absolute top-0 right-4 h-14 flex items-center">
              <ThemeToggleButton />
            </div>
          </div>
        ) : (
          <div className="relative border-b border-white/10 dark:border-gray-700/20 bg-white/50 dark:bg-gray-dark/50 backdrop-blur-sm">
            {currentChat && <ChatHeader title={currentChat.title} />}
            <div className="absolute top-0 right-4 h-14 flex items-center">
              <ThemeToggleButton />
            </div>
          </div>
        )}

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
          {currentChat?.messages.length === 0 ? (
            <EmptyState username="Amélie" />
          ) : (
            <div className="px-4 sm:px-8 md:px-16 py-6 max-w-[850px] mx-auto w-full">
              {currentChat?.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  type={message.type}
                />
              ))}
            </div>
          )}
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
