import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

import { marked } from "marked"
import { MemoizedCodeBlock } from "./code-block-highlighter-chunks"

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
    code: MemoizedCodeBlock,
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

const ReactMarkdownMemo = React.memo(
    ({ children, ...props }: any) => {
        return (
            <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                {...props}
            >
                {children}
            </ReactMarkdown>
        )
    },
    (prevProps, nextProps) => prevProps.children === nextProps.children
)

export const MemoizedMarkdown = React.memo(
    ({ children }: any) => {
        const tokens = React.useMemo(() => marked.lexer(children), [children])

        return (
            <>
                {tokens.map((token: any, index: number) => {
                    return (
                        <ReactMarkdownMemo key={index}>
                            {token.raw}
                        </ReactMarkdownMemo>
                    )
                })}
            </>
        )
    },
    (prevProps, nextProps) => prevProps.children === nextProps.children
)
