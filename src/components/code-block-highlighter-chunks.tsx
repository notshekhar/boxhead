import { CopyButton } from "./common"
import React from "react"
import { useTheme } from "next-themes"

import Prism from "prismjs"
import "prismjs/components/prism-diff"
import "prismjs/components/prism-r"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-c"
import "prismjs/components/prism-go"
import "prismjs/components/prism-jsx"

/**
 * I have converted text-sm to text-base
 * and text-xs to text-sm
 */

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

const MemoizedCodeLine = React.memo(
    ({ children, language }: any) => {
        const { theme, resolvedTheme } = useTheme()

        const html = Prism.highlight(
            children,
            Prism.languages[language],
            language
        )

        return (
            <div
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        )
    },
    (prevProps, nextProps) =>
        prevProps.children === nextProps.children &&
        prevProps.language === nextProps.language
)

export const NoLanguageCodeBlock = React.memo(
    ({ children, className, language, ...props }: any) => {
        return (
            <div className="mb-4 border border-gray-light dark:border-gray-dark bg-gray-lighter dark:bg-gray-darker">
                <div className="sticky top-0 z-5 flex items-center justify-between px-4 py-2 bg-gray-lighter/80 dark:bg-gray-darker/80 backdrop-blur-sm border-b border-gray-light dark:border-gray-dark">
                    <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                        {getLanguageDisplayName(language)}
                    </span>
                    <CopyButton text={children} />
                </div>
                <pre className="bg-gray-lighter dark:bg-gray-darker text-text-light dark:text-text-dark p-4 text-sm font-mono overflow-x-auto m-0 border-0">
                    <code>{children}</code>
                </pre>
            </div>
        )
    }
)

export const MemoizedCodeBlock = React.memo(
    ({ children, className, ...props }: any) => {
        const isInline = !className?.includes("language-")
        const codeContent = String(children).replace(/\n$/, "")

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

        const match = /language-(\w+)/.exec(className || "")
        const language = match ? match[1] : ""

        if (!Prism.languages[language]) {
            return (
                <NoLanguageCodeBlock language={language}>
                    {children}
                </NoLanguageCodeBlock>
            )
        }

        if (language) {
            const tokens = React.useMemo(() => {
                return codeContent.split("\n")
            }, [codeContent])

            return (
                <div className="mb-4 border border-gray-light dark:border-gray-dark bg-gray-lighter dark:bg-gray-darker">
                    <div className="sticky top-0 z-5 flex items-center justify-between px-4 py-2 bg-gray-lighter/80 dark:bg-gray-darker/80 backdrop-blur-sm border-b border-gray-light dark:border-gray-dark">
                        <span className="text-sm font-semibold text-text-light dark:text-text-dark">
                            {getLanguageDisplayName(language)}
                        </span>
                        <CopyButton text={codeContent} />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="shiki-container [&_pre]:!bg-transparent p-4 [&_pre]:!m-0 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:!bg-transparent">
                            {tokens.map((token: any, index: number) => (
                                <MemoizedCodeLine
                                    key={index}
                                    language={language}
                                >
                                    {token}
                                </MemoizedCodeLine>
                            ))}
                        </div>
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
