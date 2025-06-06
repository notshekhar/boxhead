import { UIMessage } from "ai"
import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
    oneDark,
    oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"

// Copy icon component
const CopyIcon = ({ className }: { className?: string }) => (
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
)

// Check icon component for copied state
const CheckIcon = ({ className }: { className?: string }) => (
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
)

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
const CodeBlock = ({ children, className, ...props }: any) => {
    const { theme, resolvedTheme } = useTheme()
    const [isCopied, setIsCopied] = useState(false)
    const match = /language-(\w+)/.exec(className || "")
    const language = match ? match[1] : ""
    const isInline = !className?.includes("language-")

    // Determine if we're in dark mode
    const isDarkMode = theme === "dark" || resolvedTheme === "dark"

    if (isInline) {
        return <code {...props}>{children}</code>
    }

    if (language) {
        const syntaxTheme = isDarkMode ? oneDark : oneLight

        // Create a custom theme to override the background
        const customSyntaxTheme = {
            ...syntaxTheme,
            'pre[class*="language-"]': {
                ...(syntaxTheme['pre[class*="language-"]'] || {}),
                background: "transparent", // remove theme background
                margin: 0,
                padding: "1rem",
                fontSize: "0.75rem",
                lineHeight: "1.5",
                userSelect: "text",
                WebkitUserSelect: "text",
                MozUserSelect: "text",
                msUserSelect: "text",
            },
            'code[class*="language-"]': {
                ...(syntaxTheme['code[class*="language-"]'] || {}),
                background: "transparent", // remove theme background
            },
        }
        return (
            <div className="mb-4 rounded-lg border border-gray-light dark:border-gray-dark bg-gray-lighter dark:bg-gray-darker">
                {/* Language header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-gray-lighter/80 dark:bg-gray-darker/80 backdrop-blur-sm border-b border-gray-light dark:border-gray-dark">
                    <span className="text-xs font-semibold text-text-light dark:text-text-dark">
                        {getLanguageDisplayName(language)}
                    </span>
                    <button
                        onClick={async () => {
                            try {
                                // Extract text content properly, handling React children
                                const textContent = React.Children.toArray(
                                    children
                                )
                                    .map((child) =>
                                        typeof child === "string"
                                            ? child
                                            : React.isValidElement(child) &&
                                              (child.props as any)?.children
                                            ? String(
                                                  (child.props as any).children
                                              )
                                            : String(child)
                                    )
                                    .join("")

                                await navigator.clipboard.writeText(textContent)
                                setIsCopied(true)
                                console.log("Code copied to clipboard")

                                // Reset the copied state after 2 seconds
                                setTimeout(() => {
                                    setIsCopied(false)
                                }, 2000)
                            } catch (err) {
                                console.error("Failed to copy code:", err)
                                // Fallback for older browsers or when clipboard API fails
                                try {
                                    const textArea =
                                        document.createElement("textarea")
                                    const textContent = React.Children.toArray(
                                        children
                                    )
                                        .map((child) =>
                                            typeof child === "string"
                                                ? child
                                                : React.isValidElement(child) &&
                                                  (child.props as any)?.children
                                                ? String(
                                                      (child.props as any)
                                                          .children
                                                  )
                                                : String(child)
                                        )
                                        .join("")
                                    textArea.value = textContent
                                    document.body.appendChild(textArea)
                                    textArea.select()
                                    document.execCommand("copy")
                                    document.body.removeChild(textArea)
                                    setIsCopied(true)
                                    console.log(
                                        "Code copied to clipboard (fallback)"
                                    )

                                    // Reset the copied state after 2 seconds
                                    setTimeout(() => {
                                        setIsCopied(false)
                                    }, 2000)
                                } catch (fallbackErr) {
                                    console.error(
                                        "Fallback copy also failed:",
                                        fallbackErr
                                    )
                                }
                            }
                        }}
                        className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                            isCopied
                                ? "text-green-600 dark:text-green-400"
                                : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark"
                        }`}
                        title={isCopied ? "Copied!" : "Copy code"}
                        disabled={isCopied}
                    >
                        {isCopied ? <CheckIcon /> : <CopyIcon />}
                        {isCopied ? "Copied" : "Copy"}
                    </button>
                </div>

                {/* Code content with syntax highlighting */}
                <SyntaxHighlighter
                    style={customSyntaxTheme}
                    language={language}
                    showLineNumbers={true}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            </div>
        )
    }

    // Fallback for code blocks without language specification
    return (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-light dark:border-gray-dark">
            {/* Header with copy button */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-lighter dark:bg-gray-darker border-b border-gray-light dark:border-gray-dark">
                <span className="text-xs font-semibold text-text-light dark:text-text-dark">
                    Code
                </span>
                <button
                    onClick={async () => {
                        try {
                            // Extract text content properly, handling React children
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

                            await navigator.clipboard.writeText(textContent)
                            setIsCopied(true)
                            console.log("Code copied to clipboard")

                            // Reset the copied state after 2 seconds
                            setTimeout(() => {
                                setIsCopied(false)
                            }, 2000)
                        } catch (err) {
                            console.error("Failed to copy code:", err)
                            // Fallback for older browsers or when clipboard API fails
                            try {
                                const textArea =
                                    document.createElement("textarea")
                                const textContent = React.Children.toArray(
                                    children
                                )
                                    .map((child) =>
                                        typeof child === "string"
                                            ? child
                                            : React.isValidElement(child) &&
                                              (child.props as any)?.children
                                            ? String(
                                                  (child.props as any).children
                                              )
                                            : String(child)
                                    )
                                    .join("")
                                textArea.value = textContent
                                document.body.appendChild(textArea)
                                textArea.select()
                                document.execCommand("copy")
                                document.body.removeChild(textArea)
                                setIsCopied(true)
                                console.log(
                                    "Code copied to clipboard (fallback)"
                                )

                                // Reset the copied state after 2 seconds
                                setTimeout(() => {
                                    setIsCopied(false)
                                }, 2000)
                            } catch (fallbackErr) {
                                console.error(
                                    "Fallback copy also failed:",
                                    fallbackErr
                                )
                            }
                        }
                    }}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-colors cursor-pointer ${
                        isCopied
                            ? "text-green-600 dark:text-green-400"
                            : "text-text-muted-light dark:text-text-muted-dark hover:bg-gray-light dark:hover:bg-gray-darker hover:text-text-light dark:hover:text-text-dark"
                    }`}
                    title={isCopied ? "Copied!" : "Copy code"}
                    disabled={isCopied}
                >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                    {isCopied ? "Copied" : "Copy"}
                </button>
            </div>

            {/* Code content */}
            <pre
                className="bg-gray-lighter dark:bg-gray-darker text-text-light dark:text-text-dark p-4 text-xs font-mono overflow-x-auto m-0 border-0"
                {...props}
            >
                <code>{children}</code>
            </pre>
        </div>
    )
}

const MarkdownComponents = {
    // Headings
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
            className="text-sm font-semibold text-text-light dark:text-text-dark mb-2 mt-3 first:mt-0"
            {...props}
        >
            {children}
        </h5>
    ),
    h6: ({ children, ...props }: any) => (
        <h6
            className="text-xs font-semibold text-text-light dark:text-text-dark mb-2 mt-3 first:mt-0"
            {...props}
        >
            {children}
        </h6>
    ),

    // Paragraphs
    p: ({ children, ...props }: any) => (
        <p
            className="text-sm text-text-light dark:text-text-dark mb-4 last:mb-0 leading-relaxed"
            {...props}
        >
            {children}
        </p>
    ),

    // Lists
    ul: ({ children, ...props }: any) => (
        <ul
            className="list-disc list-inside text-sm text-text-light dark:text-text-dark mb-4 space-y-1 ml-2"
            {...props}
        >
            {children}
        </ul>
    ),
    ol: ({ children, ...props }: any) => (
        <ol
            className="list-decimal list-inside text-sm text-text-light dark:text-text-dark mb-4 space-y-1 ml-2"
            {...props}
        >
            {children}
        </ol>
    ),
    li: ({ children, ...props }: any) => (
        <li className="text-sm text-text-light dark:text-text-dark" {...props}>
            {children}
        </li>
    ),

    // Code
    code: CodeBlock,

    pre: CodeBlock,

    // Links
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

    // Blockquotes
    blockquote: ({ children, ...props }: any) => (
        <blockquote
            className="border-l-4 border-accent-blue bg-gray-lighter dark:bg-gray-darker pl-4 py-2 mb-4 italic text-text-muted-light dark:text-text-muted-dark"
            {...props}
        >
            {children}
        </blockquote>
    ),

    // Tables
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
            className="px-4 py-2 text-left text-xs font-semibold text-text-light dark:text-text-dark border border-gray-light dark:border-gray-dark"
            {...props}
        >
            {children}
        </th>
    ),
    td: ({ children, ...props }: any) => (
        <td
            className="px-4 py-2 text-xs text-text-light dark:text-text-dark border border-gray-light dark:border-gray-dark"
            {...props}
        >
            {children}
        </td>
    ),

    // Horizontal rule
    hr: ({ ...props }: any) => (
        <hr
            className="border-gray-light dark:border-gray-dark my-6"
            {...props}
        />
    ),

    // Strong and emphasis
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

    // Strikethrough (from GFM)
    del: ({ children, ...props }: any) => (
        <del
            className="line-through text-text-muted-light dark:text-text-muted-dark"
            {...props}
        >
            {children}
        </del>
    ),
}

export const ChatMessage: React.FC<{ message: UIMessage }> = ({
    message,
}: {
    message: UIMessage
}) => {
    // User message component
    if (message.role === "user") {
        return (
            <div className="flex justify-end mb-6 items-end">
                {/* Message bubble */}
                <div className="max-w-[80%] bg-white dark:bg-gray-darker rounded-xl py-3 px-4 border border-gray-light dark:border-gray-dark mr-2">
                    <div className="text-sm text-text-light dark:text-text-dark">
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkGfm]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        )
    }
    // AI message component
    else {
        return (
            <div className="flex mb-6 items-start">
                {/* AI avatar */}
                {/* <div className="flex-shrink-0 mr-3 w-8 h-8 rounded-lg bg-white dark:bg-[#1E1F25] flex items-center justify-center text-[#2D7FF9] dark:text-accent-blue font-bold border border-[#2D7FF9]/20 dark:border-gray-dark">
          <span className="font-bold text-sm">AI</span>
        </div> */}

                {/* Message bubble - no border */}
                <div className="max-w-[85%] px-1">
                    <div className="text-sm text-text-light dark:text-text-dark leading-relaxed">
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkGfm]}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {/* Uncomment this to show typing animation when needed */}
                    {/* <TypingAnimation /> */}
                </div>
            </div>
        )
    }
}
