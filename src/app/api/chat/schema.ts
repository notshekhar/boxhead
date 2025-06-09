import { z } from "zod"
import { ModelName, ModelProvider } from "./models"

const textPartSchema = z.object({
    text: z.string(),
    type: z.enum(["text"]),
})

export const bodyValidator = z.object({
    id: z.string().uuid(),
    message: z
        .object({
            id: z.string().uuid(),
            createdAt: z.coerce.date(),
            role: z.enum(["user"]),
            content: z.string(),
            parts: z.array(textPartSchema),
            experimental_attachments: z
                .array(
                    z.object({
                        url: z.string().url(),
                        name: z.string(),
                        contentType: z.enum([
                            "image/png",
                            "image/jpg",
                            "image/jpeg",
                        ]),
                    })
                )
                .optional(),
        })
        .required(),
    model_provider: z.nativeEnum(ModelProvider),
    model_name: z.nativeEnum(ModelName),
})
