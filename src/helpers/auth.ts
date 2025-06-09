import { cookies } from "next/headers"
import { verify } from "./jwt"
import { z } from "zod"

const schema = z.object({
    id: z.number(),
    email: z.string().email(),
    name: z.string(),
})
export async function auth() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("token")
        if (!token) {
            return null
        }
        const decoded = verify(token.value, schema)
        return decoded
    } catch (error) {
        console.error(error)
        return null
    }
}
