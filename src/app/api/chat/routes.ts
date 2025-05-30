import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
})

export async function POST() {
    const stream = streamText({
        model: google("gemini-2.5-flash"),
        prompt: "",
    })
    return
}
