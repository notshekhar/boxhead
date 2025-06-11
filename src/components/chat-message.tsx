import { UIMessage } from "ai"
import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { codeToHtml } from "shiki"
import { useTheme } from "next-themes"

/**
 * I have converted text-sm to text-base
 * and text-xs to text-sm
 */

// Copy icon component
const CopyIcon = React.memo(({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
))

// Check icon component for copied state
const CheckIcon = React.memo(({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20,6 9,17 4,12" />
    </svg>
))

// Custom hook for copy functionality
const useCopyToClipboard = () => {
    const [isCopied, setIsCopied] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            try {
                const textArea = document.createElement("textarea")
                textArea.value = text
                document.body.appendChild(textArea)
                textArea.select()
                document.execCommand("copy")
                document.body.removeChild(textArea)
                setIsCopied(true)
                setTimeout(() => setIsCopied(false), 2000)
            } catch (fallbackErr) {
                console.error("Failed to copy:", fallbackErr)
            }
        }
    }

    return { isCopied, copyToClipboard }
}

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

// Copy button component
const CopyButton = React.memo(
    ({ text, label = "Copy" }: { text: string; label?: string }) => {
        const { isCopied, copyToClipboard } = useCopyToClipboard()

        return (
            <button
                onClick={() => copyToClipboard(text)}
                className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors cursor-pointer ${
                    isCopied
                        ? "text-green-600 dark:text-green-400"
                        : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark"
                }`}
                title={isCopied ? "Copied!" : `Copy ${label.toLowerCase()}`}
                disabled={isCopied}
            >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
                {isCopied ? "Copied" : label}
            </button>
        )
    }
)

// Custom code block component with syntax highlighting
const CodeBlock = React.memo(({ children, className, ...props }: any) => {
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
                const shikiTheme = isDarkMode ? "vitesse-dark" : "vitesse-light"
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
                : React.isValidElement(child) && (child.props as any)?.children
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
})

const MarkdownComponents = {
    h1: ({ children, ...props }: any) => (
        <h1
            className="text-2xl font-bold text-text-light dark:text-text-dark mb-4 mt-6 first:mt-0"
            {...props}
        >
            {children}
        </h1>
    ),
    h2: ({ children, ...props }: any) => (
        <h2
            className="text-xl font-bold text-text-light dark:text-text-dark mb-3 mt-5 first:mt-0"
            {...props}
        >
            {children}
        </h2>
    ),
    h3: ({ children, ...props }: any) => (
        <h3
            className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 mt-4 first:mt-0"
            {...props}
        >
            {children}
        </h3>
    ),
    h4: ({ children, ...props }: any) => (
        <h4
            className="text-base font-semibold text-text-light dark:text-text-dark mb-2 mt-3 first:mt-0"
            {...props}
        >
            {children}
        </h4>
    ),
    h5: ({ children, ...props }: any) => (
        <h5
            className="text-base font-semibold text-text-light dark:text-text-dark mb-2 mt-3 first:mt-0"
            {...props}
        >
            {children}
        </h5>
    ),
    h6: ({ children, ...props }: any) => (
        <h6
            className="text-sm font-semibold text-text-light dark:text-text-dark mb-2 mt-3 first:mt-0"
            {...props}
        >
            {children}
        </h6>
    ),
    p: ({ children, ...props }: any) => (
        <p
            className="text-base text-text-light dark:text-text-dark mb-4 last:mb-0 leading-relaxed break-words overflow-wrap-anywhere"
            {...props}
        >
            {children}
        </p>
    ),
    ul: ({ children, ...props }: any) => (
        <ul
            className="list-disc list-outside text-base text-text-light dark:text-text-dark mb-4 space-y-2 pl-6 ml-2"
            {...props}
        >
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: any) => (
        <ol
            className="list-decimal list-outside text-base text-text-light dark:text-text-dark mb-4 space-y-2 pl-6 ml-2"
            {...props}
        >
            {children}
        </ol>
    ),
    li: ({ children, ...props }: any) => (
        <li
            className="text-base text-text-light dark:text-text-dark leading-relaxed"
            {...props}
        >
            {children}
        </li>
    ),
    code: CodeBlock,
    pre: ({ children, ...props }: any) => <pre {...props}>{children}</pre>,
    a: ({ children, href, ...props }: any) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-blue hover:text-secondary-light underline transition-colors"
            {...props}
        >
            {children}
        </a>
    ),
    blockquote: ({ children, ...props }: any) => (
        <blockquote
            className="border-l-4 border-accent-blue bg-gray-lighter dark:bg-gray-darker pl-4 py-2 mb-4 italic text-text-muted-light dark:text-text-muted-dark"
            {...props}
        >
            {children}
        </blockquote>
    ),
    table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto mb-4">
            <table
                className="min-w-full border-collapse border border-gray-light dark:border-gray-dark"
                {...props}
            >
                {children}
            </table>
        </div>
    ),
    thead: ({ children, ...props }: any) => (
        <thead className="bg-gray-lighter dark:bg-gray-darker" {...props}>
            {children}
        </thead>
    ),
    tbody: ({ children, ...props }: any) => (
        <tbody
            className="divide-y divide-gray-light dark:divide-gray-dark"
            {...props}
        >
            {children}
        </tbody>
    ),
    tr: ({ children, ...props }: any) => (
        <tr
            className="border-b border-gray-light dark:border-gray-dark"
            {...props}
        >
            {children}
        </tr>
    ),
    th: ({ children, ...props }: any) => (
        <th
            className="px-4 py-2 text-left text-sm font-semibold text-text-light dark:text-text-dark border border-gray-light dark:border-gray-dark"
            {...props}
        >
            {children}
        </th>
    ),
    td: ({ children, ...props }: any) => (
        <td
            className="px-4 py-2 text-sm text-text-light dark:text-text-dark border border-gray-light dark:border-gray-dark"
            {...props}
        >
            {children}
        </td>
    ),
    hr: ({ ...props }: any) => (
        <hr className="border-gray-300 dark:border-gray-800 my-6" {...props} />
    ),
    strong: ({ children, ...props }: any) => (
        <strong
            className="font-semibold text-text-light dark:text-text-dark"
            {...props}
        >
            {children}
        </strong>
    ),
    em: ({ children, ...props }: any) => (
        <em className="italic text-text-light dark:text-text-dark" {...props}>
            {children}
        </em>
    ),
    del: ({ children, ...props }: any) => (
        <del
            className="line-through text-text-muted-light dark:text-text-muted-dark"
            {...props}
        >
            {children}
        </del>
    ),
}

export const ChatMessage: React.FC<{ message: UIMessage; isLoading?: boolean }> = React.memo(
    ({ message, isLoading = false }: { message: UIMessage; isLoading?: boolean }) => {
        if (message.role === "user") {
            return (
                <div className="flex flex-col items-end mb-6">
                    <div className="max-w-[80%] bg-white dark:bg-gray-darker rounded-xl py-3 px-4 border border-gray-light dark:border-gray-dark mr-2 overflow-x-scroll">
                        <div className="text-base text-text-light dark:text-text-dark break-words overflow-wrap-anywhere">
                            <ReactMarkdown
                                components={MarkdownComponents}
                                remarkPlugins={[remarkGfm]}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                    <div className="flex justify-end mt-3 mr-2">
                        <CopyButton text={message.content} label="Copy" />
                    </div>
                </div>
            )
        }

        return (
            <div className="flex mb-6 items-start">
                <div className="max-w-[100%] px-1 min-w-0">
                    <div className="text-base text-text-light dark:text-text-dark leading-relaxed break-words overflow-wrap-anywhere">
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkGfm]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                    {!isLoading && (
                        <div className="flex justify-start mt-3">
                            <CopyButton text={message.content} label="Copy" />
                        </div>
                    )}
                </div>
            </div>
        )
    }
)
