import { User } from "@/components/auth-context"
import { ChatPage } from "@/components/chat-page"
import { auth } from "@/helpers/auth"
import { getUser } from "@/lib/queries"
import axios from "axios"
import { cookies } from "next/headers"

interface ChatPageProps {
    params: {
        chatId: string
    }
}

async function getChat(chatId: string, authToken: string) {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL}/api/chat?chatId=${chatId}`,
            {
                withCredentials: true,
                headers: {
                    Cookie: `token=${authToken}`,
                },
            }
        )
        const data = response.data
        return data
    } catch (error) {
        return null
    }
}

export default async function Chat({ params }: ChatPageProps) {
    // Get sidebar visibility from cookies server-side
    const cookieStore = await cookies()
    const sidebarCookie = cookieStore.get("sidebarVisible")

    const authToken = cookieStore.get("token")

    // Default to true for desktop if no cookie is set
    const initialSidebarVisible =
        sidebarCookie?.value === "false" ? false : true

    const authUser = await auth()

    let user = null

    if (authUser) {
        user = (await getUser(authUser.email)) as unknown as User
    }

    const resolvedParams = await params
    const chatId = resolvedParams.chatId

    const chat = await getChat(chatId, authToken?.value || "")

    return (
        <ChatPage
            initialSidebarVisible={initialSidebarVisible}
            initialUser={user}
            chatId={chatId}
            initialChat={chat}
        />
    )
}
