import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Get the SVG icon path for a model icon/provider
 * If icon is a URL, return it directly. Otherwise, get from public folder.
 */

const localIcons = new Set([
    "gemini",
    "openai",
    "anthropic",
    "qwen",
    "deepseek",
    "meta",
    "minimax",
    "mistral",
    "google",
]);

export const getModelIcon = (icon: string): string => {
    // Check if icon is a URL (starts with http:// or https:// or //)
    if (
        icon.startsWith("http://") ||
        icon.startsWith("https://") ||
        icon.startsWith("//")
    ) {
        return icon;
    }

    // Check if icon is an absolute path (starts with /)
    if (icon.startsWith("/")) {
        return icon;
    }

    if (localIcons.has(icon)) {
        return `/model-icons/${icon}.svg`;
    }

    return `/model-icons/default.svg`;
};
