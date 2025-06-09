import { z } from "zod"
import { bodyValidator } from "../schema"
import { CoreMessage, generateObject } from "ai"
import { getModel } from "../models"
import crypto from "crypto"

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as z.infer<typeof bodyValidator>

        const validate = bodyValidator.safeParse(body)

        if (!validate.success) {
            return new Response(validate.error.message, { status: 400 })
        }

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

        const messages = [
            {
                role: "system",
                content: prompt,
            },
            body.message,
        ] as CoreMessage[]

        const text = await generateObject({
            model: getModel(body.model_provider, body.model_name),
            messages,
            schema: z.object({
                chatTitle: z.string(),
            }),
        })

        // const chat = await createChat({
        //     userId:
        // })

        return new Response(
            JSON.stringify({
                id: "",
                title: text.object.chatTitle,
            }),
            { status: 200 }
        )
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 })
    }
}
