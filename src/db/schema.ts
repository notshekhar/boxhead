import {
    decimal,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    avatar: varchar({ length: 255 }),
    password: varchar({ length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    pubId: uuid("pub_id").notNull().unique(), // pub_id
    title: varchar({ length: 255 }).notNull(),
    parentId: integer("parent_id").references((): any => chats.id, {
        onDelete: "cascade",
    }),
    userId: integer("user_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
});

export const models = pgTable("models", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    pubId: varchar("pub_id", { length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 255 }),
    inputTokenCost: decimal("input_token_cost", { precision: 30, scale: 15 })
        .default("0")
        .notNull(),
    outputTokenCost: decimal("output_token_cost", { precision: 30, scale: 15 })
        .default("0")
        .notNull(),
    status: varchar("status", { length: 255 }).notNull().default("active"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const credits = pgTable("credits", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id),
    amount: decimal("amount", { precision: 30, scale: 15 })
        .default("0")
        .notNull(), // current credit balance of the user
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creditLogs = pgTable("credit_logs", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => users.id),
    modelId: integer("model_id").references(() => models.id),
    inputTokens: integer("input_tokens").notNull(), // input tokens used
    outputTokens: integer("output_tokens").notNull(), // output tokens generated
    speed: integer("speed").notNull(), // tokens per second
    amount: decimal("amount", { precision: 30, scale: 15 }).notNull(), // amount added or deducted from the user's credit
    fee: decimal("fee", { precision: 30, scale: 15 }).default("0").notNull(), // fee paid out platform from the amount deducted or added to the user's credit
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable(
    "transactions",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        userId: integer("user_id").references(() => users.id),
        method: varchar("method", { length: 255 }).notNull(), // credit, debit, giftcard
        type: varchar("type", { length: 255 }).notNull(), // refund, credit
        gateway: varchar("gateway", { length: 255 }).notNull(), // stripe, paypal, etc.
        amount: integer("amount").notNull(), // amount paid or received from the user
        fee: integer("fee").default(0).notNull(), // fee paid out platform from the amount paid or received from the user
        refId: varchar("ref_id", { length: 255 }).unique().notNull(), // reference id of the transaction
        status: varchar("status", { length: 255 }).notNull(), // pending, completed, failed
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [index("idx_transactions_type").on(table.type)]
);
