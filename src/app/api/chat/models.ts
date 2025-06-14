import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
})

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
})

export enum ModelProvider {
    GOOGLE = "google",
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    OPENROUTER = "openrouter",
}

export const modelProviders = {
    [ModelProvider.GOOGLE]: google,
    [ModelProvider.OPENAI]: openai,
    [ModelProvider.ANTHROPIC]: anthropic,
    [ModelProvider.OPENROUTER]: openrouter,
}

export enum ModelName {
    GEMINI_2_5_FLASH_PREVIEW_05_20 = "gemini-2.5-flash-preview-05-20",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",

    LLAMA_3_3_8B = "meta-llama/llama-3.3-8b-instruct:free",
    PHI_4_REASONING_PLUS = "microsoft/phi-4-reasoning-plus:free",
    DEEPSEEK_R1_0528 = "deepseek/deepseek-r1-0528:free",
    QWEN_3_30B_A3B = "qwen/qwen3-30b-a3b-04-28:free",

    GPT_4O = "gpt-4o",
    GPT_4O_MINI = "gpt-4o-mini",
    CLAUDE_3_5_SONNET = "claude-3.5-sonnet",
}

export const ModelProviderMapping = {
    [ModelName.GEMINI_2_5_FLASH_PREVIEW_05_20]: ModelProvider.GOOGLE,
    [ModelName.GEMINI_2_0_FLASH]: ModelProvider.GOOGLE,
    [ModelName.GEMINI_2_0_FLASH_LITE]: ModelProvider.GOOGLE,

    [ModelName.LLAMA_3_3_8B]: ModelProvider.OPENROUTER,
    [ModelName.PHI_4_REASONING_PLUS]: ModelProvider.OPENROUTER,
    [ModelName.DEEPSEEK_R1_0528]: ModelProvider.OPENROUTER,
    [ModelName.QWEN_3_30B_A3B]: ModelProvider.OPENROUTER,

    [ModelName.GPT_4O]: ModelProvider.OPENAI,
    [ModelName.GPT_4O_MINI]: ModelProvider.OPENAI,
    [ModelName.CLAUDE_3_5_SONNET]: ModelProvider.ANTHROPIC,
}

export const models = [
    {
        name: ModelName.GEMINI_2_0_FLASH_LITE,
        displayName: "Gemini 2.0 Flash Lite",
        provider: ModelProvider.GOOGLE,
        default: true,
    },
    {
        name: ModelName.GEMINI_2_5_FLASH_PREVIEW_05_20,
        displayName: "Gemini 2.5 Flash Preview",
        provider: ModelProvider.GOOGLE,
    },
    {
        name: ModelName.LLAMA_3_3_8B,
        displayName: "Llama 3.3 8B",
        provider: ModelProvider.OPENROUTER,
    },
    {
        name: ModelName.PHI_4_REASONING_PLUS,
        displayName: "Phi 4 Reasoning Plus",
        provider: ModelProvider.OPENROUTER,
    },
    {
        name: ModelName.DEEPSEEK_R1_0528,
        displayName: "DeepSeek R1 0528",
        provider: ModelProvider.OPENROUTER,
    },
    {
        name: ModelName.QWEN_3_30B_A3B,
        displayName: "Qwen 3.30B A3B",
        provider: ModelProvider.OPENROUTER,
    },
    {
        name: ModelName.GEMINI_2_0_FLASH,
        displayName: "Gemini 2.0 Flash",
        provider: ModelProvider.GOOGLE,
    },
    {
        name: ModelName.GPT_4O,
        displayName: "GPT-4o",
        provider: ModelProvider.OPENAI,
    },
    {
        name: ModelName.GPT_4O_MINI,
        displayName: "GPT-4o Mini",
        provider: ModelProvider.OPENAI,
    },
    {
        name: ModelName.CLAUDE_3_5_SONNET,
        displayName: "Claude 3.5 Sonnet",
        provider: ModelProvider.ANTHROPIC,
    },
]

export const getModel = (model: ModelName) => {
    const provider = ModelProviderMapping[model]
    return (modelProviders[provider] as any)(model)
}
