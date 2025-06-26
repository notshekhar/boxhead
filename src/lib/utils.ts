/**
 * Get the SVG icon path for a model icon/provider
 * If icon is a URL, return it directly. Otherwise, get from public folder.
 */
export const getModelIcon = (icon: string): string => {
    // Check if icon is a URL (starts with http:// or https:// or //)
    if (
        icon.startsWith("http://") ||
        icon.startsWith("https://") ||
        icon.startsWith("//")
    ) {
        return icon
    }

    // Check if icon is an absolute path (starts with /)
    if (icon.startsWith("/")) {
        return icon
    }

    // Otherwise, treat as icon name and get from public folder
    switch (icon) {
        case "gemini":
        case "openai":
        case "anthropic":
        case "qwen":
        case "deepseek":
        case "meta":
        case "minimax":
        case "mistral":
        case "google":
            return `/model-icons/${icon}.svg`
        default:
            return `/model-icons/default.svg`
    }
}
