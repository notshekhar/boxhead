import { AuthPopup } from "@/components/auth-popup"
import { ModelsProvider } from "@/components/models-context"
import { Toaster } from "react-hot-toast"
import axios from "axios"
import { cookies } from "next/headers"

import { NuqsAdapter } from "nuqs/adapters/next"

interface Model {
    name: string
    provider: string
    default?: boolean
}

async function getModels() {
    try {
        const response = await axios.get(
            `${process.env.BASE_URL}/api/chat/models`
        )
        return response.data
    } catch (error) {
        console.error("Failed to fetch models:", error)
        return []
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
    params: Promise<{
        chatId: string
    }>
}>) {
    // Fetch models and get selected model from cookie
    const [models, cookieStore] = await Promise.all([getModels(), cookies()])

    const selectedModelCookie = cookieStore.get("selectedModel")

    // Get default model from fetched models
    const defaultModel = models.find((model: Model) => model.default)
    const defaultModelName = defaultModel?.name || "gemini-2.0-flash-lite"

    // Check if selected model from cookie is valid
    let initialSelectedModel = defaultModelName

    if (selectedModelCookie?.value) {
        const isValidModel = models.some(
            (model: Model) => model.name === selectedModelCookie.value
        )
        if (isValidModel) {
            initialSelectedModel = selectedModelCookie.value
        }
    }

    return (
        <NuqsAdapter>
            <ModelsProvider
                initialModels={models}
                initialSelectedModel={initialSelectedModel}
            >
                {children}
                <AuthPopup />
            </ModelsProvider>
            <Toaster position="bottom-right" />
        </NuqsAdapter>
    )
}
