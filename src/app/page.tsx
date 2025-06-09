import { User } from "@/components/auth-context"
import { ChatPage } from "@/components/chat-page"
import { auth } from "@/helpers/auth"
import { getUser } from "@/lib/queries"
import { cookies } from "next/headers"
import { users } from "@/db/schema"

export default async function Home() {
    // Get sidebar visibility from cookies server-side
    const cookieStore = await cookies()
    const sidebarCookie = cookieStore.get("sidebarVisible")

    // Default to true for desktop if no cookie is set
    const initialSidebarVisible =
        sidebarCookie?.value === "false" ? false : true

    const authUser = await auth()

    let user = null

    if (authUser) {
        user = (await getUser(authUser.email)) as unknown as User
    }

    return (
        <ChatPage
            initialSidebarVisible={initialSidebarVisible}
            initialUser={user}
        />
    )
}
