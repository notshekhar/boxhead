import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export default async function Home() {
    // Generate a new UUID for the chat session
    const chatId = uuidv4()

    // Redirect to the chat page with the generated UUID
    redirect(`/chat/${chatId}`)
}
