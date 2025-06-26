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

const minimax = createOpenAI({
    baseURL: "https://api.minimax.io/v1",
    apiKey: process.env.MINIMAX_API_KEY,
})

export enum ModelName {
    GEMINI_2_5_FLASH = "gemini-2.5-flash",
    GEMINI_2_0_FLASH = "gemini-2.0-flash",
    GEMINI_2_0_FLASH_LITE = "gemini-2.0-flash-lite",

    LLAMA_3_3_8B = "llama-3.3-8b-instruct",
    DEEPSEEK_R1_0528 = "deepseek-r1-0528",
    QWEN_3_30B_A3B = "qwen3-30b-a3b-04-28",

    MINIMAX_M1 = "MiniMax-M1",

    GPT_4O = "gpt-4o",
    GPT_4O_MINI = "gpt-4o-mini",
    CLAUDE_3_5_SONNET = "claude-3.5-sonnet",
    CLAUDE_4_SONNET = "claude-4-sonnet",
}

const modelMapping: Record<
    ModelName,
    {
        model: any
        providerOptions?: any
    }
> = {
    [ModelName.GEMINI_2_0_FLASH_LITE]: {
        model: google("gemini-2.0-flash-lite"),
    },
    [ModelName.GEMINI_2_5_FLASH]: {
        model: google("gemini-2.5-flash"),
        providerOptions: {
            google: {
                thinkingConfig: {
                    thinkingBudget: 8000,
                    includeThoughts: true,
                },
            },
        },
    },
    [ModelName.QWEN_3_30B_A3B]: {
        model: openrouter("qwen/qwen3-30b-a3b-04-28:free"),
    },
    [ModelName.DEEPSEEK_R1_0528]: {
        model: openrouter("deepseek/deepseek-r1-0528:free"),
    },
    [ModelName.LLAMA_3_3_8B]: {
        model: openrouter("meta-llama/llama-3.3-8b-instruct:free"),
    },
    [ModelName.GEMINI_2_0_FLASH]: {
        model: google("gemini-2.0-flash"),
    },
    [ModelName.GPT_4O]: {
        model: openai("gpt-4o"),
    },
    [ModelName.GPT_4O_MINI]: {
        model: openai("gpt-4o-mini"),
    },
    [ModelName.CLAUDE_3_5_SONNET]: {
        model: anthropic("claude-3.5-sonnet"),
    },
    [ModelName.CLAUDE_4_SONNET]: {
        model: anthropic("claude-4-sonnet-20250514"),
    },
    [ModelName.MINIMAX_M1]: {
        model: minimax("MiniMax-M1"),
    },
}

export const models = [
    {
        name: ModelName.GEMINI_2_0_FLASH_LITE,
        displayName: "Gemini 2.0 Flash Lite",
        icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/gemini_2_5_pro.webp",
        default: true,
    },
    {
        name: ModelName.GEMINI_2_5_FLASH,
        displayName: "Gemini 2.5 Flash",
        icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/gemini_2_5_flash_thinking.webp",
    },
    {
        name: ModelName.QWEN_3_30B_A3B,
        displayName: "Qwen 3.30B A3B",
        icon: "qwen",
    },
    {
        name: ModelName.DEEPSEEK_R1_0528,
        displayName: "DeepSeek R1 0528",
        icon: "deepseek",
    },
    {
        name: ModelName.LLAMA_3_3_8B,
        displayName: "Llama 3.3 8B",
        icon: "meta",
    },
    {
        name: ModelName.GEMINI_2_0_FLASH,
        displayName: "Gemini 2.0 Flash",
        icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/gemini_2_0_flash.webp",
    },
    // {
    //     name: ModelName.MINIMAX_M1,
    //     displayName: "MiniMax M1",
    //     icon: "minimax",
    // },
    // {
    //     name: ModelName.GPT_4O,
    //     displayName: "GPT-4o",
    //     icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/gpt_4o.webp",
    // },
    // {
    //     name: ModelName.GPT_4O_MINI,
    //     displayName: "GPT-4o Mini",
    //     icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/gpt_4o_mini_new.webp",
    // },
    // {
    //     name: ModelName.CLAUDE_3_5_SONNET,
    //     displayName: "Claude 3.5 Sonnet",
    //     icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/claude_3_5_sonnet.webp",
    // },
    // {
    //     name: ModelName.CLAUDE_4_SONNET,
    //     displayName: "Claude 4 Sonnet",
    //     icon: "https://cdn.jsdelivr.net/gh/foyer-work/cdn-files@latest/models/claude_4_sonnet_thinking.webp",
    // },
]

export const getModel = (model: ModelName) => {
    return modelMapping[model]
}
