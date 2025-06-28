import { db } from "@/db";
import { credits } from "@/db/schema";
import { auth } from "@/helpers/auth";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }
        const userId = session.id;

        const credit = await db
            .select()
            .from(credits)
            .where(eq(credits.userId, userId));

        return new Response(JSON.stringify(credit), { status: 200 });
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
