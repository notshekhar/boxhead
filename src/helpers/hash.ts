import { createHash } from "node:crypto"

export const hash = (text: string) => {
    return createHash("sha256").update(text).digest("hex")
}
