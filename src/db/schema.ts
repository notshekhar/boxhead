import { sql } from "drizzle-orm"
import { date, integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar({ length: 255 }),
    createdAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})
export const chats = pgTable("chats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => users.id),
    createdAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})

export const messages = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chatId: integer().references(() => chats.id),
    userId: integer().references(() => users.id),
    role: varchar({ length: 255 }).notNull(),
    parts: jsonb("parts").notNull(),
    attachments: jsonb("attachments"),
    createdAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: date()
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})
