import { CoreMessage, smoothStream, streamText } from "ai"
import { assistantPrompt } from "./prompts"
import { getModel, ModelName, ModelProvider } from "./models"
import { bodyValidator } from "./schema"
import { auth } from "@/helpers/auth"
import { createChat, getChat } from "@/lib/queries"
import { generateChatTitle } from "@/helpers/ai"

export async function GET() {
    try {
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const authUser = await auth()

        if (!authUser) {
            return new Response("Unauthorized", { status: 401 })
        }

        const body = await request.json()

        const validate = bodyValidator.safeParse(body)

        if (!validate.success) {
            return new Response(validate.error.message, { status: 400 })
        }

        const { model } = validate.data

        let chatId = body.id

        const chat = await getChat({
            userId: authUser.id,
            pubId: chatId,
        })

        if (!chat) {
            const title = await generateChatTitle(model, validate.data.messages)

            const newChat = await createChat({
                userId: authUser.id,
                title,
                pubId: chatId,
            })

            chatId = newChat.pubId
        }

        const messages = [
            assistantPrompt({
                model,
            }),
            ...validate.data.messages,
        ] as CoreMessage[]

        const stream = streamText({
            model: getModel(model),
            messages,
            maxSteps: 5,
            maxRetries: 3,
            experimental_transform: smoothStream({
                delayInMs: 20,
                chunking: "word",
            }),
            onError: (error) => {
                console.error(error)
            },
        })

        return stream.toDataStreamResponse()
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
