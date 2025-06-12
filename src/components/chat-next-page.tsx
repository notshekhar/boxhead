import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { cookies } from "next/headers"
import { ChatPage } from "./chat-page"

interface ChatPageProps {
    params: {
        chatId: string
    }
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
        chatId = uuidv4()
    }

    // Fetch chats
    const chats = await getChats(authToken?.value || "")

    return (
        <ChatPage
            initialSidebarVisible={initialSidebarVisible}
            chatId={chatId}
            initialChats={chats?.chats || []}
        />
    )
}
