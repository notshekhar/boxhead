import { models } from "../models"

export async function GET(request: Request) {
    try {
        return new Response(JSON.stringify(models), {
            status: 200,
        })
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: "Failed to get models",
            }),
            {
                status: 500,
            }
        )
    }
}
