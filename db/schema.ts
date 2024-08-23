import {
	integer,
	pgTable,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	given_name: varchar("given_name", { length: 255 }),
	family_name: varchar("family_name", { length: 255 }),
	email: varchar("email", { length: 255 }),
	created_at: timestamp("created_at").defaultNow(),
	auth_sub: varchar("auth_sub", { length: 255 }).primaryKey()
});

export const games = pgTable("games", {
    game_id: integer("game_id").primaryKey().generatedAlwaysAsIdentity(),
    game_name: varchar("game_name", { length: 255 }),
    game_description: varchar("game_description", { length: 255 })
});

export const owned_games = pgTable("owned_games", {
	auth_sub: varchar("auth_sub", { length: 255 }).references(() => users.auth_sub),
	game_id: integer("game_id").references(() => games.game_id)
});
