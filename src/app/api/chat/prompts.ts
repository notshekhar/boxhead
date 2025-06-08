import { ModelName, ModelProvider } from "./models"

export const assistantPrompt = ({
    modelProvider,
    modelName,
}: {
    modelProvider: ModelProvider
    modelName: ModelName
}) => {
    return {
        role: "system",
        content: `You are boxhead, a helpful assistant that helps user with anything.
    You are currently in a chat with a user. 

    # Metadata
    - current time: ${new Date().toLocaleTimeString()}
    - model provider: ${modelProvider}
    - model name: ${modelName}

    #Guidelines
    - Don't just randomly tell user the model name and provider, tell only when user asks
    `,
    } as const
}
