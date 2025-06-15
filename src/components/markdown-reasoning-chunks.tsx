import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { marked } from "marked"

const ReactMarkdownMemo = React.memo(
    ({ children, ...props }: any) => {
        return (
            <ReactMarkdown remarkPlugins={[remarkGfm]} {...props}>
                {children}
            </ReactMarkdown>
        )
    },
    (prevProps, nextProps) => prevProps.children === nextProps.children
)

export const MemoizedMarkdownReasoning = React.memo(
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
