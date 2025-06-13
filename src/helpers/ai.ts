import { getModel, ModelName } from "@/app/api/chat/models"
import { generateObject, Message } from "ai"
import { z } from "zod"

export async function generateChatTitle(model: ModelName, messages: any[]) {
    const prompt = `
        You are a assistant that tells the title for the chat based on the user's query.

        # Guidelines:
        - The title should be a single sentence that captures the main idea of the chat.
        - The title should be no more than 10 words.
        - The title should be in the same language as the user's query.

        # Example:
        User: What is the capital of France?
        Assistant: Capital of France

        User: Write a poem about the sky
        Assistant: Sky Poem
        `

    messages = [
        {
            role: "system",
            content: prompt,
        },
        ...messages,
    ] as Message[]

    const response = await generateObject({
        model: getModel(model),
        messages,
        schema: z.object({
            chatTitle: z.string(),
        }),
    })

    return response.object.chatTitle
}
