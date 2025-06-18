import {
    createResumableStreamContext,
    ResumableStreamContext,
} from "resumable-stream"
import { after } from "next/server"

import { createClient } from "redis"

let globalStreamContext: ResumableStreamContext | null = null

let redisPublisher: ReturnType<typeof createClient> | null = null
let redisSubscriber: ReturnType<typeof createClient> | null = null

export async function getStreamContext() {
    if (!globalStreamContext) {
        try {
            if (!redisPublisher) {
                redisPublisher = createClient({ url: process.env.REDIS_URL })
                redisSubscriber = redisPublisher.duplicate()
                await redisPublisher.connect()
                await redisSubscriber.connect()
            }
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
