import { db } from "@/db"
import { chats, messages } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function createChat(data: { userId: number; title: string }) {
    try {
        const chat = await db
            .insert(chats)
            .values({
                userId: data.userId,
                title: data.title,
            })
            .returning()

        return chat[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getChats(data: { userId: number }) {
    try {
        const all = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, data.userId))

        return all
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getChat(data: { userId: number; pubId: string }) {
    try {
        const chat = await db
            .select()
            .from(chats)
            .where(
                and(eq(chats.userId, data.userId), eq(chats.pubId, data.pubId))
            )

        return chat[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function updateChat(data: {
    userId: number
    pubId: string
    title: string
}) {
    try {
        const chat = await db
            .update(chats)
            .set({
                title: data.title,
            })
            .where(
                and(eq(chats.userId, data.userId), eq(chats.pubId, data.pubId))
            )
            .returning()

        return chat[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function deleteChat(data: { userId: number; pubId: string }) {
    try {
        const chat = await db
            .delete(chats)
            .where(
                and(eq(chats.userId, data.userId), eq(chats.pubId, data.pubId))
            )
            .returning()

        return chat[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getMessages(data: { chatId: number; userId: number }) {
    try {
        const all_messages = await db
            .select()
            .from(messages)
            .where(
                and(
                    eq(messages.chatId, data.chatId),
                    eq(messages.userId, data.userId)
                )
            )

        return all_messages
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function saveMessage(data: {
    chatId: number
    userId: number
    role: string
    parts: any[]
    attachments: any[]
}) {
    try {
        const message = await db.insert(messages).values(data).returning()
        return message[0]
    } catch (error) {
        console.error(error)
        throw error
    }
}
