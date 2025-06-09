import { date, integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    createdAt: date("created_at").defaultNow().notNull(),
})
export const chats = pgTable("chats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id),
    createdAt: date("created_at").defaultNow().notNull(),
})

export const messages = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chatId: integer("chat_id").references(() => chats.id),
    userId: integer("user_id").references(() => users.id),
    role: varchar({ length: 255 }).notNull(),
    parts: jsonb("parts").notNull(),
    attachments: jsonb("attachments"),
    createdAt: date("created_at").defaultNow().notNull(),
})
