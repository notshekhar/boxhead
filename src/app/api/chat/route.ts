import { checkBotId } from "botid/server";

import { appendResponseMessages, Message, smoothStream, streamText } from "ai";
import { assistantPrompt } from "./prompts";
import { getModel } from "./models";
import { bodyValidator } from "./schema";
import { auth } from "@/helpers/auth";
import {
    createChat,
    deleteChat,
    getAllChatMessages,
    getChat,
    saveCreditLog,
    saveMessage,
} from "@/lib/queries";
import { generateChatTitle } from "@/helpers/ai";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { credits, models } from "@/db/schema";

export async function GET(request: Request) {
    try {
        const authUser = await auth();

        if (!authUser) {
            return new Response("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("chatId");

        if (!chatId) {
            return new Response("Chat ID is required", { status: 400 });
        }

        const chat = await getChat({
            userId: authUser.id,
            pubId: chatId,
        });

        if (!chat) {
            return new Response(
                JSON.stringify({
                    chat: null,
                    messages: [],
                }),
                { status: 200 }
            );
        }

        const messages = await getAllChatMessages({
            chatId: chat.id,
            userId: authUser.id,
        });

        return new Response(
            JSON.stringify({
                chat: chat,
                messages: messages,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const verification = await checkBotId();

        if (verification.isBot) {
            return new Response("Access denied", { status: 403 });
        }

        const session = await auth();

        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        const validate = bodyValidator.safeParse(body);

        if (!validate.success) {
            return new Response(validate.error.message, { status: 400 });
        }

        const lastMessage = validate.data.messages[
            validate.data.messages.length - 1
        ] as Message;

        if (lastMessage.role !== "user") {
            return new Response("Invalid request", { status: 400 });
        }

        const { model } = validate.data;

        const model_results = await db
            .select()
            .from(models)
            .where(eq(models.pubId, model));

        const modelData = model_results[0];

        const userCreditsResults = await db
            .select()
            .from(credits)
            .where(eq(credits.userId, session.id));

        const userCredits = userCreditsResults[0];

        if (!userCredits) {
            return new Response(
                "Insufficient credit balance please buy credits",
                { status: 400 }
            );
        }

        if (Number(userCredits.amount) <= 0) {
            return new Response("Insufficient credits please buy credits", {
                status: 400,
            });
        }

        if (!modelData) {
            return new Response("Model not found", { status: 404 });
        }

        const chatId = body.id;

        let chat = null;

        if (!validate.data.incognito) {
            chat = await getChat({
                userId: session.id,
                pubId: chatId,
            });

            if (!chat) {
                const title = await generateChatTitle(lastMessage.content);

                const newChat = await createChat({
                    userId: session.id,
                    title,
                    pubId: chatId,
                });
                chat = newChat;
            }
            if (!chat || !chat.id) {
                return new Response("Chat not found", { status: 404 });
            }
        }

        const messages = [
            assistantPrompt({
                model,
            }),
            ...validate.data.messages,
        ] as Message[];

        const modelConfig = getModel(model);

        const startTime = Date.now();

        const stream = streamText({
            model: modelConfig.model,
            messages,
            maxSteps: 5,
            maxRetries: 3,
            providerOptions: modelConfig.providerOptions,
            experimental_transform: smoothStream({
                delayInMs: 20,
                chunking: "line",
            }),
            onError: (error) => {
                console.error(error);
            },
            onFinish: async ({ response, text, steps, reasoning, usage }) => {
                const totalTimeTaken = (Date.now() - startTime) / 1000;
                try {
                    if (validate.data.incognito || !chat) {
                        return;
                    }

                    await saveMessage({
                        chatId: chat.id,
                        userId: session.id,
                        role: lastMessage.role,
                        content: lastMessage.content,
                        parts: lastMessage.parts ?? [],
                        attachments: lastMessage.experimental_attachments ?? [],
                    });

                    if (!text) {
                        return;
                    }

                    const [_, assistantMessage] = appendResponseMessages({
                        messages: [lastMessage],
                        responseMessages: response.messages,
                    });

                    await saveMessage({
                        chatId: chat.id,
                        userId: session.id,
                        role: "assistant",
                        content: text,
                        parts: assistantMessage.parts ?? [],
                        attachments:
                            assistantMessage.experimental_attachments ?? [],
                    });

                    await saveCreditLog({
                        userId: session.id,
                        usage,
                        model: {
                            id: modelData.id,
                            pubId: modelData.pubId,
                            name: modelData.name,
                            inputTokenCost: Number(modelData.inputTokenCost),
                            outputTokenCost: Number(modelData.outputTokenCost),
                            status: modelData.status as "active" | "inactive",
                            createdAt: modelData.createdAt,
                        },
                        totalTimeTaken,
                    });
                } catch (error) {
                    console.error(error);
                }
            },
        });

        return stream.toDataStreamResponse({
            sendReasoning: true,
        });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const authUser = await auth();

        if (!authUser) {
            return new Response("Unauthorized", { status: 401 });
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("chatId");

        if (!chatId) {
            return new Response("Chat ID is required", { status: 400 });
        }

        const chat = await getChat({
            userId: authUser.id,
            pubId: chatId,
        });

        if (!chat) {
            return new Response("Chat not found", { status: 404 });
        }

        await deleteChat({
            pubId: chatId,
            userId: authUser.id,
        });

        return new Response("Chat deleted", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
