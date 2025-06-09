import { z } from "zod"
import { ModelName, ModelProvider } from "./models"

const textPartSchema = z.object({
    text: z.string(),
    type: z.enum(["text"]),
})

const messageSchema = z.object({
    role: z.string(),
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
})
