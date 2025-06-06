import React, { useEffect, useRef } from "react"
import { UIMessage } from "ai"
import { ChatMessage } from "./chat-message"

export const MeasuredMessage: React.FC<{
    index: number
    message: UIMessage
    setRowHeight: (index: number, size: number) => void
}> = ({ index, message, setRowHeight }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            const height = ref.current.getBoundingClientRect().height
            setRowHeight(index, height)
        }
    }, [ref.current, index, message.content])

    return (
        <div ref={ref}>
            <ChatMessage message={message} />
        </div>
    )
}
