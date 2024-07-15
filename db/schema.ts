import {
	integer,
	pgTable,
	serial,
	timestamp,
	varchar
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	event_games_sub: integer("event_games_sub").primaryKey(),
	given_name: varchar("given_name", { length: 255 }),
	family_name: varchar("family_name", { length: 255 }),
	email: varchar("email", { length: 255 }),
	created_at: timestamp("created_at").defaultNow(),
	auth_sub: varchar("auth_sub", { length: 255 }).notNull()
});

export const games = pgTable("games", {
	game_id: serial("game_id").primaryKey(),
	game_name: varchar("game_name", { length: 255 }),
	game_description: varchar("game_description", { length: 255 })
});

export const owned_games = pgTable("owned_games", {
	event_games_sub: integer("event_games_sub").references(
		() => users.event_games_sub
	),
	game_id: integer("game_id").references(() => games.game_id)
});
