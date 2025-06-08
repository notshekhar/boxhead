import { sql } from "drizzle-orm"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password"),
    createdAt: int("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: int("updated_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})

export const messages = sqliteTable("messages", {
    id: int().primaryKey({ autoIncrement: true }),
    userId: int("user_id").references(() => users.id),
    createdAt: int("created_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: int("updated_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})
