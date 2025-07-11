import { z } from "zod"
import { ModelName } from "./models"

const textPartSchema = z
    .object({
        type: z.string(),
        text: z.string().optional(),
    })
    .passthrough()

const messageSchema = z.object({
    id: z.union([z.string(), z.number()]),
    role: z.enum(["data", "user", "system", "assistant"]),
    content: z.string(),
    parts: z.array(textPartSchema),
    experimental_attachments: z
        .array(
            z.object({
                url: z.string().url(),
                name: z.string(),
                contentType: z.enum(["image/png", "image/jpg", "image/jpeg"]),
            })
        )
        .optional(),
})

export const bodyValidator = z.object({
    id: z.string().uuid("Invalid chat id"),
    messages: z.array(messageSchema).min(1, "At least one message is required"),
    model: z.nativeEnum(ModelName),
    incognito: z.boolean().optional(),
})
