ALTER TABLE "chats" DROP CONSTRAINT "chats_parent_id_chats_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_parent_id_chats_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;