"use client"

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"
import axios from "axios"

interface Model {
    name: string
    displayName: string
    icon: string
    default?: boolean
}

interface ModelsContextType {
    models: Model[]
    selectedModel: Model | null
    setSelectedModel: (model: Model) => void
    isLoading: boolean
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined)

interface ModelsProviderProps {
    children: ReactNode
    initialModels?: Model[]
    initialSelectedModel?: string
}

export function ModelsProvider({
    children,
    initialModels = [],
    initialSelectedModel,
}: ModelsProviderProps) {
    const [models, setModels] = useState<Model[]>(initialModels)
    const [selectedModel, setSelectedModelState] = useState<Model | null>(() => {
        if (initialSelectedModel) {
            const foundModel = initialModels.find(model => model.name === initialSelectedModel)
            if (foundModel) return foundModel
        }

        // Get from cookie if available (client-side only)
        if (typeof window !== "undefined") {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("selectedModel="))
                ?.split("=")[1]

            if (cookieValue) {
                const foundModel = initialModels.find(model => model.name === cookieValue)
                if (foundModel) return foundModel
            }
        }

        // Fallback to default model or first model
        const defaultModel = initialModels.find((model) => model.default)
        return defaultModel || initialModels[0] || null
    })
    const [isLoading, setIsLoading] = useState<boolean>(
        initialModels.length === 0
    )

    // Fetch models if not provided initially
    useEffect(() => {
        if (models.length === 0) {
            fetchModels()
        }
    }, [models.length])

    // Validate selected model when models change
    useEffect(() => {
        if (models.length > 0) {
            const isValidModel = selectedModel && models.some(
                (model) => model.name === selectedModel.name
            )
            if (!isValidModel) {
                const defaultModel =
                    models.find((model) => model.default) || models[0]
                setSelectedModelState(defaultModel)
                // Reset cookie to default model
                if (typeof window !== "undefined" && defaultModel) {
                    document.cookie = `selectedModel=${defaultModel.name}; path=/; max-age=${
                        60 * 60 * 24 * 365
                    }`
                }
            }
        }
    }, [models, selectedModel])

    const fetchModels = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("/api/chat/models")
            setModels(response.data)
        } catch (error) {
            console.error("Failed to fetch models:", error)
            setModels([])
        } finally {
            setIsLoading(false)
        }
    }

    const setSelectedModel = (model: Model) => {
        setSelectedModelState(model)
        // Save to cookie
        if (typeof window !== "undefined") {
            document.cookie = `selectedModel=${model.name}; path=/; max-age=${
                60 * 60 * 24 * 365
            }`
        }
    }

    return (
        <ModelsContext.Provider
            value={{
                models,
                selectedModel,
                setSelectedModel,
                isLoading,
            }}
        >
            {children}
        </ModelsContext.Provider>
    )
}

export function useModels() {
    const context = useContext(ModelsContext)
    if (context === undefined) {
        throw new Error("useModels must be used within a ModelsProvider")
    }
    return context
}
