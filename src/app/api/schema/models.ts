import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
})

export enum ModelProvider {
    GOOGLE = "google",
}

export const modelProviders = {
    [ModelProvider.GOOGLE]: google,
}

export enum ModelName {
    GEMINI_2_5_FLASH_PREVIEW_05_20 = "gemini-2.5-flash-preview-05-20",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",
}

export const modelValidator = z.object({
    model_provider: z.nativeEnum(ModelProvider),
    model_name: z.nativeEnum(ModelName),
})
