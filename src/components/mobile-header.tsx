"use client";

import React from "react";
import { HeaderControls } from "@/components/header-controls";
import { ThemeToggleButton } from "@/components/theme-toggle-button";

interface MobileHeaderProps {
    onToggleSidebar: () => void;
    onNewChat: () => void;
    onOpenSearch: () => void;
    isSidebarOpen: boolean;
}

export const MobileHeader = React.memo(
    ({
        onToggleSidebar,
        onNewChat,
        onOpenSearch,
        isSidebarOpen,
    }: MobileHeaderProps) => {
        return (
            <div className="fixed top-0 left-0 right-0 z-30 bg-[#F5F5F5]/90 dark:bg-[#0F0F0F]/90 backdrop-blur-md border-b border-gray-light dark:border-gray-dark chat:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <HeaderControls
                        onToggleSidebar={onToggleSidebar}
                        onNewChat={onNewChat}
                        onOpenSearch={onOpenSearch}
                        isSidebarOpen={isSidebarOpen}
                    />
                    <ThemeToggleButton />
                </div>
            </div>
        );
    }
);
