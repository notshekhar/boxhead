import { sql } from "drizzle-orm"
import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const chats = pgTable("chats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    pubId: uuid("pub_id").notNull().unique(), // pub_id
    title: varchar({ length: 255 }).notNull(),
    userId: integer("user_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const messages = pgTable("messages", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chatId: integer("chat_id").references(() => chats.id, {
        onDelete: "cascade",
    }),
    userId: integer("user_id").references(() => users.id),
    role: varchar({ length: 255 }).notNull(),
    content: text("content").notNull(),
    parts: jsonb("parts").notNull(),
    attachments: jsonb("attachments"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})
