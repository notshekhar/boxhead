"use client"

import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
    useCallback,
} from "react"
import { useModels } from "./models-context"
import { UIMessage } from "ai"
import { useChat } from "@ai-sdk/react"
import { errorToast } from "@/hooks/error-toast"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "./auth-context"

import { parseAsBoolean, useQueryState } from "nuqs"

interface Chat {
    id: string
    pubId: string
    title: string
    parentId?: string
}

interface ChatContextType {
    chatId: string
    chat: {
        chat: Chat
        messages: UIMessage[]
    } | null
    setChat: (
        chat: {
            chat: Chat
            messages: UIMessage[]
        } | null
    ) => void
    messages: UIMessage[]
    input: string
    setInput: (input: string) => void
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
    setMessages: (messages: UIMessage[]) => void
    chats: Chat[]
    fetchChats: () => Promise<void>
    isChatLoading: boolean
    incognito: boolean
    setIncognito: (incognito: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
    children: ReactNode
    chatId: string
    initialChats: Chat[] | null
}

export const ChatProvider = React.memo(
    ({ children, chatId, initialChats }: ChatProviderProps) => {
        const { selectedModel } = useModels()
        const { user } = useAuth()

        const router = useRouter()

        const [isChatLoading, setIsChatLoading] = useState<boolean>(false)

        const [incognito, setIncognito] = useQueryState(
            "incognito",
            parseAsBoolean.withDefault(false)
        )

        const [chats, setChats] = useState<Chat[]>(initialChats || [])

        const [initialChat, setInitialChat] = useState<{
            chat: Chat
            messages: UIMessage[]
        } | null>(null)

        async function getChat(chatId: string) {
            try {
                const response = await axios.get(`/api/chat`, {
                    params: {
                        chatId,
                    },
                    withCredentials: true,
                })
                const data = response.data
                return data
            } catch (error) {
                return null
            }
        }

        async function getChats() {
            try {
                const response = await axios.get("/api/chats", {
                    withCredentials: true,
                })
                const data = response.data
                return data
            } catch (error) {
                return null
            }
        }

        const fetchChat = useCallback(async () => {
            setIsChatLoading(true)
            try {
                const chat = await getChat(chatId)
                if (
                    (!chat || !chat?.chat) &&
                    window.location.pathname !== "/"
                ) {
                    router.push("/")
                }
                console.log(chat)
                setInitialChat(chat)
            } finally {
                setIsChatLoading(false)
            }
        }, [chatId])

        useEffect(() => {
            fetchChat()
        }, [chatId])

        const fetchChats = useCallback(async () => {
            const chats = await getChats()
            setChats(chats?.chats || [])
        }, [])

        useEffect(() => {
            fetchChats()
        }, [user])
        

        const {
            messages,
            input,
            setInput,
            handleSubmit,
            isLoading,
            setMessages,
        } = useChat({
            api: "/api/chat",
            experimental_prepareRequestBody: ({ messages }) => {
                return {
                    model: selectedModel?.name,
                    id: chatId,
                    incognito,
                    messages,
                }
            },
            onError: (error) => {
                errorToast(error)
            },
            onResponse: () => {
                if (typeof window !== "undefined" && !incognito) {
                    window.history.replaceState(null, "", `/chat/${chatId}`)
                    fetchChats()
                }
            },
            initialMessages: initialChat?.messages || [],
            credentials: "include",
        })

        useEffect(() => {
            // if last message have no content, remove the last message from assistant and user and show a errorToast
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1]
                if (!lastMessage.content) {
                    setMessages(messages.slice(0, -1))
                    errorToast("Last message has no content")
                }
            }
        }, [isLoading])

        useEffect(() => {
            if (window.location.pathname === "/") {
                setMessages(initialChat?.messages || [])
            }
        }, [initialChat])

        const contextValue: ChatContextType = {
            chatId,
            chat: initialChat,
            setChat: setInitialChat,
            messages,
            input,
            setInput,
            handleSubmit,
            isLoading,
            setMessages,
            chats,
            isChatLoading,
            fetchChats,
            incognito,
            setIncognito,
        }
        return (
            <ChatContext.Provider value={contextValue}>
                {children}
            </ChatContext.Provider>
        )
    },
    (prevProps, nextProps) => {
        return prevProps.chatId === nextProps.chatId
    }
)

export const useChatContext = () => {
    const context = useContext(ChatContext)
    if (context === undefined) {
        throw new Error("useChatContext must be used within a ChatProvider")
    }
    return context
}
