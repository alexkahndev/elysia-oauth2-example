CREATE TABLE IF NOT EXISTS "games" (
	"game_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "games_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_name" varchar(255),
	"game_description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "owned_games" (
	"auth_sub" varchar(255),
	"game_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"given_name" varchar(255),
	"family_name" varchar(255),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"auth_sub" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "owned_games" ADD CONSTRAINT "owned_games_auth_sub_users_auth_sub_fk" FOREIGN KEY ("auth_sub") REFERENCES "public"."users"("auth_sub") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "owned_games" ADD CONSTRAINT "owned_games_game_id_games_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("game_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
