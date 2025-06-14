import { auth } from "@/helpers/auth"
import { createChat, getChat, saveMessage } from "@/lib/queries"
import { bodyValidator } from "./schema"
import { Message } from "ai"

export async function POST(request: Request) {
    try {
        const session = await auth()

        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await request.json()

        const validate = bodyValidator.safeParse(body)

        if (!validate.success) {
            return new Response(validate.error.message, { status: 400 })
        }

        const lastMessage = validate.data.messages[
            validate.data.messages.length - 1
        ] as Message

        if (lastMessage.role !== "assistant") {
            return new Response("Invalid request", { status: 400 })
        }

        const parentChat = await getChat({
            userId: session.id,
            pubId: validate.data.parentId,
        })

        if (!parentChat) {
            return new Response("Parent chat not found", { status: 400 })
        }

        const chat = await createChat({
            userId: session.id,
            title: `Branch - ${parentChat.title}`,
            pubId: validate.data.id,
            parentId: parentChat.id,
        })

        if (!chat) {
            return new Response("Failed to create chat", { status: 500 })
        }

        for (const message of validate.data.messages) {
            await saveMessage({
                chatId: chat.id,
                userId: session.id,
                role: message.role,
                content: message.content,
                parts: message.parts ?? [],
                attachments: message.experimental_attachments ?? [],
            })
        }

        return new Response(JSON.stringify({ chat }), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
