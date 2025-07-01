import { generateCodeVerifier, generateState, Google } from "arctic"
import { checkBotId } from "botid/server";
import { cookies } from "next/headers"

const google = new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.BASE_URL}/api/auth/google/callback`
)

export async function GET(): Promise<Response> {
    const verification = await checkBotId();

    if (verification.isBot) {
        return new Response("Access denied", { status: 403 });
    }

    const state = generateState()

    const codeVerifier = generateCodeVerifier()

    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
        "email",
    ])

    const cookieStore = await cookies()

    cookieStore.set("google_oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    })

    cookieStore.set("google_code_verifier", codeVerifier, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        sameSite: "lax",
    })

    return Response.redirect(url.toString())
}
