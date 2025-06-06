import { CoreMessage, streamText } from "ai"
import { calculator } from "../tools/calculator"
import { assistantPrompt } from "../prompts/assistant"
import {
    ModelName,
    ModelProvider,
    modelProviders,
    modelValidator,
} from "../schema/models"

export async function POST(request: Request) {
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
    })

    return stream.toDataStreamResponse()
}

export async function GET() {
    return new Response("Hello, world!")
}
