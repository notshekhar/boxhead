import { createHash } from "node:crypto"

const hash = (text: string) => {
    return createHash("sha256").update(text).digest("hex")
}
