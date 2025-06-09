import { auth } from "@/helpers/auth"
import { getUser } from "@/lib/queries"

export async function GET(request: Request) {
    try {
        const authUser = await auth()
        if (!authUser) {
            return new Response("Unauthorized", { status: 401 })
        }
        const user = await getUser(authUser.email)

        if (!user) {
            return new Response("User not found", { status: 404 })
        }

        return new Response(JSON.stringify({ user }), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response("Internal Server Error", { status: 500 })
    }
}
