import React from "react"

interface ChatHeaderProps {
    title: string
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({ title }) => {
    return (
        <div>
            <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-blue/10 to-accent-indigo/10 dark:from-accent-blue/5 dark:to-accent-indigo/5 flex items-center justify-center mr-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-accent-blue"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </div>
                <h2 className="text-lg font-medium truncate max-w-[calc(100vw-160px)]">
                    {title}
                </h2>
            </div>
        </div>
    )
})
