import { v4 as uuidv4, v4 } from "uuid"
import axios from "axios"
import { cookies } from "next/headers"
import { ChatPage } from "./chat-page"
import { ChatProvider } from "./chat-context"

interface ChatPageProps {
    params: Promise<{
        chatId: string
    }>
}

async function getChats(authToken: string) {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/api/chats`, {
            withCredentials: true,
            headers: {
                Cookie: `token=${authToken}`,
            },
        })
        const data = response.data
        return data
    } catch (error) {
        return null
    }
}

async function getChat(chatId: string, authToken: string) {
    try {
        const response = await axios.get(`${process.env.BASE_URL}/api/chat`, {
            params: {
                chatId,
                initialMessages: true,
            },
            headers: {
                Cookie: `token=${authToken}`,
            },
        })
        const data = response.data
        return data
    } catch (error) {
        return null
    }
}

export default async function ChatNextPage({ params }: ChatPageProps) {
    // Get cookies server-side
    const cookieStore = await cookies()
    const sidebarCookie = cookieStore.get("sidebarVisible")
    const authToken = cookieStore.get("token")

    // Default to true for desktop if no cookie is set
    const initialSidebarVisible =
        sidebarCookie?.value === "false" ? false : true

    const resolvedParams = await params

    let chatId = resolvedParams.chatId

    if (!chatId) {
        chatId = v4()
    }

    // Fetch chats
    const chats = await getChats(authToken?.value || "")
    const chat = await getChat(chatId, authToken?.value || "")

    console.log(chat)

    return (
        <ChatProvider
            chatId={chatId}
            initialChats={chats?.chats || []}
            initialMessages={chat?.messages || []}
        >
            <ChatPage initialSidebarVisible={initialSidebarVisible} />
        </ChatProvider>
    )
}
