import {
    appendResponseMessages,
    CoreMessage,
    Message,
    smoothStream,
    streamText,
} from "ai"
import { assistantPrompt } from "./prompts"
import { getModel } from "./models"
import { bodyValidator } from "./schema"
import { auth } from "@/helpers/auth"
import { createChat, getChat, saveMessage } from "@/lib/queries"
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

        const lastMessage =
            validate.data.messages[validate.data.messages.length - 1]

        if (lastMessage.role !== "user") {
            return new Response("Invalid request", { status: 400 })
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
        ] as Message[]

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
            onFinish: async ({ response }) => {
                try {
                    await saveMessage({
                        chatId,
                        userId: authUser.id,
                        role: lastMessage.role,
                        parts: lastMessage.parts,
                        attachments: lastMessage.experimental_attachments ?? [],
                    })

                    const [_, assistantMessage] = appendResponseMessages({
                        messages: [...messages],
                        responseMessages: response.messages,
                    })

                    await saveMessage({
                        chatId,
                        userId: authUser.id,
                        role: "assistant",
                        parts: assistantMessage.parts ?? [],
                        attachments:
                            assistantMessage.experimental_attachments ?? [],
                    })
                } catch (error) {
                    console.error(error)
                }
            },
        })

        return stream.toDataStreamResponse()
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
