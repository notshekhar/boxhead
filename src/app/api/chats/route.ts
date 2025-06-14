import { db } from "@/db"
import { chats } from "@/db/schema"
import { auth } from "@/helpers/auth"
import { and, desc, eq, ilike, sql } from "drizzle-orm"

export async function GET(request: Request) {
    try {
        const authUser = await auth()

        if (!authUser) {
            return new Response("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(request.url)

        const page = searchParams.get("page") || 1
        const search = searchParams.get("search")

        const all_chats = await db
            .select({
                id: chats.id,
                title: chats.title,
                createdAt: chats.createdAt,
                parentId: chats.parentId,
                pubId: chats.pubId,
                total: sql<number>`count(*) over ()`,
            })
            .from(chats)
            .where(
                and(
                    eq(chats.userId, authUser.id),
                    search ? ilike(chats.title, `%${search}%`) : undefined
                )
            )
            .limit(10)
            .offset((Number(page) - 1) * 10)
            .orderBy(desc(chats.createdAt))

        return new Response(
            JSON.stringify({
                chats: all_chats,
                pages: Math.ceil(all_chats[0]?.total ?? 0 / 10),
            }),
            { status: 200 }
        )
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
