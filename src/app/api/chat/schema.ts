import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
})

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

export enum ModelProvider {
    GOOGLE = "google",
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
}

export const modelProviders = {
    [ModelProvider.GOOGLE]: google,
    [ModelProvider.OPENAI]: openai,
    [ModelProvider.ANTHROPIC]: anthropic,
}

export enum ModelName {
    GEMINI_2_5_FLASH_PREVIEW_05_20 = "gemini-2.5-flash-preview-05-20",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",
    GPT_4O = "gpt-4o",
    GPT_4O_MINI = "gpt-4o-mini",
    CLAUDE_3_5_SONNET = "claude-3.5-sonnet",
}

export const modelValidator = z.object({
    model_provider: z.nativeEnum(ModelProvider),
    model_name: z.nativeEnum(ModelName),
})
