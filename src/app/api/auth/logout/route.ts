import { cookies } from "next/headers"

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies()

        cookieStore.delete("token")

        return new Response(
            JSON.stringify({ message: "Logged out successfully" }),
            {
                status: 200,
            }
        )
    } catch (error) {
        console.error("Logout error:", error)
        return new Response("Internal server error", { status: 500 })
    }
}
