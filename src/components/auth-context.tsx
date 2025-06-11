"use client"

import axios from "axios"

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react"

// Types
export interface User {
    id: string
    email: string
    name: string
    avatar?: string
    createdAt: string
}

export interface AuthContextType {
    user: User | null
    isAuthPopupOpen: boolean
    openAuthPopup: () => void
    closeAuthPopup: () => void
    logout: () => void
    withAuth: (fn: () => any) => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({
    children,
    initialUser,
}: {
    children: ReactNode
    initialUser: User | null
}) {
    const [user, setUser] = useState<User | null>(initialUser || null)
    const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === "GOOGLE_LOGIN_SUCCESS") {
                checkAuth()
                closeAuthPopup()
            }
        }
        window.addEventListener("message", handleMessage)
        return () => {
            window.removeEventListener("message", handleMessage)
        }
    }, [])

    const handleAuthSuccess = async () => {
        try {
            const response = await axios.get("/api/auth/me", {
                withCredentials: true,
            })
            return response.data.user
        } catch (error) {
            console.error("Auth check failed:", error)
            return null
        }
    }

    const checkAuth = async () => {
        try {
            const user = await handleAuthSuccess()
            setUser(user)
        } catch (error) {
            console.error("Auth check failed:", error)
            setUser(null)
        }
    }

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            setUser(null)
        }
    }

    const openAuthPopup = () => setIsAuthPopupOpen(true)
    const closeAuthPopup = () => setIsAuthPopupOpen(false)

    const withAuth = (fn: () => any) => {
        if (!user) {
            openAuthPopup()
            // We'll need to store the function to call after auth

            // Listen for auth success and cleanup
            const handleMessage = (event: MessageEvent) => {
                if (event.data.type === "GOOGLE_LOGIN_SUCCESS") {
                    handleAuthSuccess().then((user) => {
                        setUser(user)
                        if (user) {
                            fn()
                        }
                    })
                    closeAuthPopup()
                    window.removeEventListener("message", handleMessage)
                }
            }
            window.addEventListener("message", handleMessage)
        } else {
            fn()
        }
    }

    const value: AuthContextType = {
        user,
        isAuthPopupOpen,
        openAuthPopup,
        closeAuthPopup,
        logout,
        withAuth,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth(initialUser?: User | null) {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    if (initialUser) {
        context.user = initialUser
    }

    return context
}
