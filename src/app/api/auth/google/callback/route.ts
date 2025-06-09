import { db } from "@/db"
import { users } from "@/db/schema"
import { sign } from "@/helpers/jwt"
import { decodeIdToken, Google, OAuth2Tokens } from "arctic"
import { cookies } from "next/headers"

const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.BASE_URL}/api/auth/google/callback`
)

export async function GET(request: Request) {
    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    const cookieStore = await cookies()
    const storedState = cookieStore.get("google_oauth_state")?.value ?? null
    const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null
    if (
        code === null ||
        state === null ||
        storedState === null ||
        codeVerifier === null
    ) {
        return new Response(null, {
            status: 400,
        })
    }
    if (state !== storedState) {
        return new Response(null, {
            status: 400,
        })
    }

    let tokens: OAuth2Tokens
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier)
    } catch (e) {
        // Invalid code or client credentials
        return new Response(null, {
            status: 400,
        })
    }

    const claims = decodeIdToken(tokens.idToken()) as {
        email: string
        name: string
        picture: string
    }

    if (!claims.email || !claims.name) {
        return new Response("Please try again later", {
            status: 400,
        })
    }

    const user = await db
        .insert(users)
        .values({
            email: claims.email,
            name: claims.name,
            avatar: claims.picture,
        })
        .onConflictDoUpdate({
            target: [users.email],
            set: {
                name: claims.name,
                avatar: claims.picture,
            },
        })
        .returning()

    if (!user || !user[0]) {
        return new Response("Please try again later", {
            status: 400,
        })
    }

    const token = sign({
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
    })

    cookieStore.set("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
    })

    return new Response(
        `
        <script>
            window.opener?.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, '*');
            window.close();
        </script>
    `,
        {
            headers: {
                "Content-Type": "text/html",
            },
        }
    )
}
