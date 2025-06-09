import jwt from "jsonwebtoken"
import { z } from "zod"

const JWT_SECRET = process.env.JWT_SECRET!

export const sign = (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "30d",
    })
}

export const verify = <T extends z.ZodTypeAny>(
    token: string,
    schema: T
): z.infer<T> => {
    const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ["HS256"],
    })
    const parsed = schema.safeParse(decoded)

    if (!parsed.success) {
        throw new Error("Invalid token")
    }

    return parsed.data
}
