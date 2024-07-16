import { type Context, Elysia, type RouteBase, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server.browser";
import { swagger } from "@elysiajs/swagger";
import { createElement } from "react";
import { Home } from "./pages/Home";
import { ClientPortal } from "./pages/ClientPortal";
import { oauth2 } from "elysia-oauth2";
import { build } from "./build";
import { authGoogle, authGoogleCallback } from "./handlers/googleAuthHandlers";
import {
	handleAuthStatus,
	handleLogout,
	handleSetRedirect
} from "./handlers/userHandlers";
import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const host = Bun.env.HOST || "localhost";
const port = Bun.env.PORT || 3000;

if (
	!Bun.env.GOOGLE_CLIENT_ID ||
	!Bun.env.GOOGLE_CLIENT_SECRET ||
	!Bun.env.GOOGLE_REDIRECT_URI
) {
	throw new Error("Google OAuth2 credentials are not set in .env file");
}

if (!Bun.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set in .env file");
}

const sql = neon(Bun.env.DATABASE_URL);
const db = drizzle(sql, {
	schema
});

export type dbType = typeof db;
export type schemaType = typeof schema;

const buildTimeStamp = await build();

const doYouLikeSwaggerUIBetter = false;

async function handleRequest(pageComponent: any, index: string) {
	const page = createElement(pageComponent);
	const stream = await renderToReadableStream(page, {
		bootstrapScripts: [index]
	});

	return new Response(stream, {
		headers: { "Content-Type": "text/html" }
	});
}

export const server = new Elysia()
	.decorate({
		db: db,
		schema: schema
	})
	.use(
		staticPlugin({
			assets: "./build",
			prefix: ""
		})
	)
	.use(
		oauth2({
			Google: [
				Bun.env.GOOGLE_CLIENT_ID,
				Bun.env.GOOGLE_CLIENT_SECRET,
				Bun.env.GOOGLE_REDIRECT_URI
			]
		})
	)
	.use(
		swagger({
			provider: doYouLikeSwaggerUIBetter ? "swagger-ui" : "scalar"
		})
	);

type Server = typeof server;
export type AuthContext = Context<RouteBase, Server["singleton"]>;

const authGoogleCookieType = t.Cookie({
	googleAuthToken: t.String(),
	user: t.Object({
		id: t.Number(),
		name: t.String(),
		email: t.String()
	}),
	redirectUrl: t.String()
});

server
	.get("/", () =>
		handleRequest(Home, `indexes/HomeIndex.${buildTimeStamp}.js`)
	)
	.get("/auth/google", authGoogle)
	.get("/auth/google/callback", authGoogleCallback,{
		cookie: authGoogleCookieType
	})
	.get("/portal", () =>
		handleRequest(
			ClientPortal,
			`indexes/ClientPortalIndex.${buildTimeStamp}.js`
		)
	)
	.post("/set-redirect-url", handleSetRedirect)
	.post("/logout", handleLogout)
	.get("/auth-status", handleAuthStatus)
	.listen(port, () => {
		console.log(`server started on http://${host}:${port}`);
	})
	.on("error", (error) => {
		console.error(`Server error: ${error.code}`);
	});
