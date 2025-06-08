import { ChatPage } from "@/components/chat-page"
import { cookies } from "next/headers"

export default async function Home() {
    // Get sidebar visibility from cookies server-side
    const cookieStore = await cookies()
    const sidebarCookie = cookieStore.get("sidebarVisible")
    
    // Default to true for desktop if no cookie is set
    const initialSidebarVisible = sidebarCookie?.value === "false" ? false : true

    return <ChatPage initialSidebarVisible={initialSidebarVisible} />
}
