import { db } from "@/db";
import { creditLogs, models } from "@/db/schema";
import { auth } from "@/helpers/auth";
import { desc, eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userId = session.id;

        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 20;
        const offset = (page - 1) * limit;

        const logs = await db
            .select({
                id: creditLogs.id,
                modelName: models.name,
                modelDescription: models.description,
                modelIcon: models.icon,
                amount: creditLogs.amount,
                fee: creditLogs.fee,
                speed: creditLogs.speed,
                inputTokensUsed: creditLogs.inputTokens,
                outputTokensGenerated: creditLogs.outputTokens,
                createdAt: creditLogs.createdAt,
                totalRows: sql`count(*) over()`,
            })
            .from(creditLogs)
            .innerJoin(models, eq(creditLogs.modelId, models.id))
            .where(eq(creditLogs.userId, userId))
            .orderBy(desc(creditLogs.id))
            .limit(limit)
            .offset(offset);

        const totalPages = Math.ceil(Number(logs[0]?.totalRows ?? 0) / limit);

        return new Response(
            JSON.stringify({
                logs: logs.map((log) => {
                    delete log.totalRows;
                    return log;
                }),
                totalPages,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}
