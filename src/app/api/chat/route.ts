import {
    appendResponseMessages,
    CoreMessage,
    Message,
    smoothStream,
    streamText,
} from "ai";
import { assistantPrompt } from "./prompts";
import { getModel } from "./models";
import { bodyValidator } from "./schema";
import { auth } from "@/helpers/auth";
import {
    createChat,
    deleteChat,
    getAllChatMessages,
    getChat,
    saveMessage,
} from "@/lib/queries";
import { generateChatTitle } from "@/helpers/ai";
import { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { calculator } from "./tools";

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
            onFinish: async ({ response, text, steps, reasoning }) => {
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
