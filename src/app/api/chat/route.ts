import { CoreMessage, smoothStream, streamText } from "ai"
import { assistantPrompt } from "./prompts"
import {
    ModelName,
    ModelProvider,
    modelProviders,
    modelValidator,
} from "./models"

export async function GET() {
    try {
        // create a new chat
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        let messages = body.messages as CoreMessage[]

        const { model_provider, model_name } = body as {
            model_provider: ModelProvider
            model_name: ModelName
        }

        const validate = modelValidator.safeParse({
            model_name,
            model_provider,
        })

        if (!validate.success) {
            return new Response(validate.error.message, { status: 400 })
        }

        messages = [
            assistantPrompt({
                modelProvider: model_provider,
                modelName: model_name,
            }),
            ...messages,
        ] as CoreMessage[]

        const stream = streamText({
            model: modelProviders[model_provider](model_name),
            messages,
            maxSteps: 5,
            maxRetries: 3,
            experimental_transform: smoothStream({
                delayInMs: 20,
                chunking: "line",
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
