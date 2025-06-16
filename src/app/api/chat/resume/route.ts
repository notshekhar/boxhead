import { auth } from "@/helpers/auth"
import { getStreamContext } from "../stream"
import { getChat, getLastUserMessageId } from "@/lib/queries"
import { createDataStream } from "ai"

export async function GET(request: Request) {
    const authUser = await auth()

    if (!authUser) {
        return new Response("Unauthorized", { status: 401 })
    }

    const url = new URL(request.url)
    const chatId = url.searchParams.get("chatId")

    if (!chatId) {
        return new Response("Chat ID is required", { status: 400 })
    }

    const chat = await getChat({
        userId: authUser.id,
        pubId: chatId,
    })

    const lastUserMessageId = await getLastUserMessageId({
        chatId: chat.id,
    })

    const streamContext = getStreamContext()

    if (!lastUserMessageId || !streamContext) {
        return new Response("Last user message not found", { status: 404 })
    }

    const streamId = `stream-${lastUserMessageId}`

    const emptyDataStream = createDataStream({
        execute: () => {},
    })

    const stream = await streamContext.resumableStream(
        streamId,
        () => emptyDataStream
    )

    if (!stream) {
        return new Response("Stream not found", { status: 404 })
    }

    return new Response(stream, {
        status: 200,
    })
}
