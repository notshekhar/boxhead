import Dexie, { Table } from "dexie"

// Types for chat caching only
export interface ChatCache {
    pubId: string // pubId from API
    title: string
    createdAt: Date
}

export class ChatDatabase extends Dexie {
    chats!: Table<ChatCache>

    constructor() {
        super("ChatDatabase")
        this.version(1).stores({
            chats: "pubId, title, createdAt",
        })
    }
}

export const db = new ChatDatabase()

// Database operations for chats only
export class ChatCacheService {
    // Chat operations
    static async saveChat(chat: { pubId: string; title: string }) {
        const now = new Date()
        const chatCache: ChatCache = {
            pubId: chat.pubId,
            title: chat.title,
            createdAt: now,
        }

        await db.chats.put(chatCache)
        return chatCache
    }

    static async getChat(chatId: string): Promise<ChatCache | undefined> {
        return await db.chats.get(chatId)
    }

    static async getAllChats(): Promise<ChatCache[]> {
        return await db.chats.orderBy("createdAt").reverse().toArray()
    }

    static async updateChatTitle(chatId: string, title: string) {
        await db.chats.update(chatId, {
            title,
        })
    }

    static async deleteChat(chatId: string) {
        await db.chats.delete(chatId)
    }

    static async saveMulitpleChats(
        chats: Array<{ pubId: string; title: string }>
    ) {
        const now = new Date()
        const chatCaches: ChatCache[] = chats.map((chat) => ({
            pubId: chat.pubId,
            title: chat.title,
            createdAt: now,
        }))

        await db.chats.bulkPut(chatCaches)
        return chatCaches
    }

    static async clearCache() {
        await db.chats.clear()
    }

    static async getCacheStats() {
        const chatCount = await db.chats.count()
        return { chatCount }
    }
}
