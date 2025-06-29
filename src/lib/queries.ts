import { ModelName } from "@/app/api/chat/models";
import { db } from "@/db";
import { chats, creditLogs, credits, messages, users } from "@/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";

export async function getUser(email: string) {
    try {
        const user = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                avatar: users.avatar,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(eq(users.email, email));
        return user[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createChat(data: {
    userId: number;
    title: string;
    pubId: string;
    parentId?: number;
}) {
    try {
        const chat = await db
            .insert(chats)
            .values({
                userId: data.userId,
                pubId: data.pubId,
                title: data.title,
                parentId: data.parentId,
            })
            .returning();

        return chat[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getChats(data: { userId: number }) {
    try {
        const all = await db
            .select()
            .from(chats)
            .where(eq(chats.userId, data.userId));

        return all;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getChat(data: { userId: number; pubId: string }) {
    try {
        const chat = await db
            .select()
            .from(chats)
            .where(
                and(eq(chats.userId, data.userId), eq(chats.pubId, data.pubId))
            );

        return chat[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function updateChat(data: {
    userId: number;
    pubId: string;
    title: string;
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
            .returning();

        return chat[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function deleteChat(data: { userId: number; pubId: string }) {
    try {
        const chat = await db
            .delete(chats)
            .where(
                and(eq(chats.userId, data.userId), eq(chats.pubId, data.pubId))
            )
            .returning();

        return chat[0];
    } catch (error) {
        console.error(error);
        throw error;
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
            );

        return all_messages;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function saveMessage(data: {
    chatId: number;
    userId: number;
    role: string;
    content: string;
    parts: any[];
    attachments: any[];
}) {
    try {
        const message = await db.insert(messages).values(data).returning();
        return message[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function getAllChatMessages(data: {
    chatId: number;
    userId: number;
}) {
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
            .orderBy(asc(messages.createdAt));

        return all_messages;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function saveCreditLog(data: {
    userId: number;
    model: {
        id: number;
        pubId: string;
        name: string;
        inputTokenCost: number;
        outputTokenCost: number;
        status: "active" | "inactive";
        createdAt: Date;
    };
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    totalTimeTaken: number;
}) {
    try {
        let totalCost =
            data.usage.promptTokens * (data.model.inputTokenCost / 1000000) +
            data.usage.completionTokens *
                (data.model.outputTokenCost / 1000000);

        const fee = totalCost * 0.1;
        totalCost += fee;

        totalCost *= -1;

        const creditLog = await db
            .insert(creditLogs)
            .values({
                userId: data.userId,
                modelId: data.model.id,
                amount: totalCost.toString(),
                fee: fee.toString(),
                inputTokens: data.usage.promptTokens,
                outputTokens: data.usage.completionTokens,
                speed: Math.round(data.usage.totalTokens / data.totalTimeTaken),
            })
            .returning();

        await db
            .update(credits)
            .set({
                amount: sql`amount + ${totalCost}`,
            })
            .where(eq(credits.userId, data.userId));

        return creditLog[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}
