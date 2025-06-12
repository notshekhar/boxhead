/**
 * I have converted text-sm to text-base
 * and text-xs to text-sm
 */

import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { codeToHtml } from "shiki"
import { CopyButton } from "./common"

// Function to get display name for programming languages
const getLanguageDisplayName = (language: string): string => {
    const languageMap: { [key: string]: string } = {
        javascript: "JavaScript",
        js: "JavaScript",
        typescript: "TypeScript",
        ts: "TypeScript",
        jsx: "JSX",
        tsx: "TSX",
        python: "Python",
        py: "Python",
        java: "Java",
        html: "HTML",
        css: "CSS",
        scss: "SCSS",
        sass: "Sass",
        less: "Less",
        json: "JSON",
        xml: "XML",
        yaml: "YAML",
        yml: "YAML",
        markdown: "Markdown",
        md: "Markdown",
        bash: "Bash",
        sh: "Shell",
        powershell: "PowerShell",
        sql: "SQL",
        php: "PHP",
        ruby: "Ruby",
        go: "Go",
        rust: "Rust",
        c: "C",
        cpp: "C++",
        csharp: "C#",
        cs: "C#",
        swift: "Swift",
        kotlin: "Kotlin",
        dart: "Dart",
        r: "R",
        matlab: "MATLAB",
        perl: "Perl",
        scala: "Scala",
        haskell: "Haskell",
        lua: "Lua",
        vim: "Vim",
        dockerfile: "Dockerfile",
        graphql: "GraphQL",
        diff: "Diff",
        patch: "Patch",
    }

    return languageMap[language.toLowerCase()] || language.toUpperCase()
}
// Custom code block component with syntax highlighting
export const CodeBlock = React.memo(
    ({ children, className, ...props }: any) => {
        const { theme, resolvedTheme } = useTheme()

        const [highlightedCode, setHighlightedCode] = useState<string>("")

        const match = /language-(\w+)/.exec(className || "")
        const language = match ? match[1] : ""
        const isInline = !className?.includes("language-")

        const isDarkMode = theme === "dark" || resolvedTheme === "dark"
        const codeContent = String(children).replace(/\n$/, "")

        useEffect(() => {
            if (!language || !codeContent) return

            const highlightCode = async () => {
                try {
                    const shikiTheme = isDarkMode
                        ? "vitesse-dark"
                        : "vitesse-light"
                    const html = await codeToHtml(codeContent, {
                        lang: language,
                        theme: shikiTheme,
                    })
                    setHighlightedCode(html)
                } catch (error) {
                    console.error("Error highlighting code:", error)
                    setHighlightedCode(
                        `<pre class="p-4 text-sm leading-relaxed m-0 bg-transparent"><code class="bg-transparent">${codeContent}</code></pre>`
                    )
                }
            }

            highlightCode()
        }, [language, codeContent, isDarkMode])

        // Inline code
        if (isInline) {
            return (
                <code
                    className="px-1.5 py-0.5 text-sm bg-gray-lighter dark:bg-gray-darker text-text-light dark:text-text-dark rounded border border-gray-light dark:border-gray-dark font-mono"
                    {...props}
                >
                    {children}
                </code>
            )
        }

        // Code block with language
        if (language) {
            return (
                <div className="mb-4 border border-gray-light dark:border-gray-dark bg-gray-lighter dark:bg-gray-darker">
                    <div className="sticky top-0 z-5 flex items-center justify-between px-4 py-2 bg-gray-lighter/80 dark:bg-gray-darker/80 backdrop-blur-sm border-b border-gray-light dark:border-gray-dark">
                        <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                            {getLanguageDisplayName(language)}
                        </span>
                        <CopyButton text={codeContent} />
                    </div>
                    <div className="overflow-x-auto">
                        {highlightedCode ? (
                            <div
                                className="shiki-container [&_pre]:!bg-transparent [&_pre]:!p-4 [&_pre]:!m-0 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:!bg-transparent"
                                dangerouslySetInnerHTML={{
                                    __html: highlightedCode,
                                }}
                            />
                        ) : (
                            <pre className="bg-transparent text-text-light dark:text-text-dark p-4 text-sm font-mono overflow-x-auto m-0">
                                <code className="bg-transparent">
                                    {codeContent}
                                </code>
                            </pre>
                        )}
                    </div>
                </div>
            )
        }

        // Generic code block
        const textContent = React.Children.toArray(children)
            .map((child) =>
                typeof child === "string"
                    ? child
                    : React.isValidElement(child) &&
                      (child.props as any)?.children
                    ? String((child.props as any).children)
                    : String(child)
            )
            .join("")

        return (
            <div className="mb-4 rounded-lg overflow-hidden border border-gray-light dark:border-gray-dark">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-lighter dark:bg-gray-darker border-b border-gray-light dark:border-gray-dark">
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        Code
                    </span>
                    <CopyButton text={textContent} />
                </div>
                <pre
                    className="bg-gray-lighter dark:bg-gray-darker text-text-light dark:text-text-dark p-4 text-sm font-mono overflow-x-auto m-0 border-0"
                    {...props}
                >
                    <code>{children}</code>
                </pre>
            </div>
        )
    }
)
