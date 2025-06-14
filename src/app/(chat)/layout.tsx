import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, User } from "@/components/auth-context"
import { AuthPopup } from "@/components/auth-popup"
import { ModelsProvider } from "@/components/models-context"
import { Toaster } from "react-hot-toast"
import { auth } from "@/helpers/auth"
import { getUser } from "@/lib/queries"
import axios from "axios"
import { cookies } from "next/headers"

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
    const authUser = await auth()

    let user = null

    if (authUser) {
        user = (await getUser(authUser.email)) as unknown as User
    }

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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider initialUser={user}>
                <ModelsProvider
                    initialModels={models}
                    initialSelectedModel={initialSelectedModel}
                >
                    {children}
                    <AuthPopup />
                </ModelsProvider>
            </AuthProvider>
            <Toaster position="bottom-right" />
        </ThemeProvider>
    )
}
