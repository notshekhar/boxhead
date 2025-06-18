import {
    createResumableStreamContext,
    ResumableStreamContext,
} from "resumable-stream"
import { after } from "next/server"

import { createClient } from "redis"

let globalStreamContext: ResumableStreamContext | null = null

const redisPublisher = createClient({ url: process.env.REDIS_URL })
const redisSubscriber = redisPublisher.duplicate()
await redisPublisher.connect()
await redisSubscriber.connect()

export function getStreamContext() {
    if (!globalStreamContext) {
        try {
            globalStreamContext = createResumableStreamContext({
                waitUntil: after,
                subscriber: redisSubscriber,
                publisher: redisPublisher,
            })
        } catch (error: any) {
            if (error.message.includes("REDIS_URL")) {
                console.log(
                    " > Resumable streams are disabled due to missing REDIS_URL"
                )
            } else {
                console.error(error)
            }
        }
    }

    return globalStreamContext
}
