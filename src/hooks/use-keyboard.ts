import { useEffect } from "react"

export function useKeyboardShortcut(shortcut: string, callback: () => void) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const parts = shortcut.split("+")
            const key = parts.pop()
            const modifiers = parts.map((modifier) => {
                const lower = modifier.toLowerCase()
                if (lower === "cmd" || lower === "meta") return "metaKey"
                if (lower === "ctrl") return "ctrlKey"
                if (lower === "shift") return "shiftKey"
                if (lower === "alt") return "altKey"
                throw new Error(`Unsupported modifier: ${modifier}`)
            })

            const allModifiersPressed = modifiers.every((mod) => event[mod])
            const keyMatch = event.key?.toLowerCase() === key?.toLowerCase()

            if (allModifiersPressed && keyMatch) {
                event.preventDefault()
                callback()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [shortcut, callback])
}
