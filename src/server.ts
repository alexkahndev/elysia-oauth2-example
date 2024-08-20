import { type Context, Elysia, type RouteBase, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server.browser";
import { swagger } from "@elysiajs/swagger";
import { createElement } from "react";
import { Home } from "./pages/Home";
import { ClientPortal } from "./pages/ClientPortal";
import { build } from "./build";
import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { googleAuthPlugin } from "./plugins/googleAuthPlugin";
import { absoluteAuthPlugin } from "./plugins/absoluteAuth";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set in .env file");
}

const sql = neon(process.env.DATABASE_URL);
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
	.use(
		staticPlugin({
			assets: "./build",
			prefix: ""
		})
	)
	.use(absoluteAuthPlugin({ db, schema }))
	.use(
		swagger({
			provider: doYouLikeSwaggerUIBetter ? "swagger-ui" : "scalar"
		})
	)
	.get("/", () =>
		handleRequest(Home, `indexes/HomeIndex.${buildTimeStamp}.js`)
	)
	.get("/portal", () =>
		handleRequest(
			ClientPortal,
			`indexes/ClientPortalIndex.${buildTimeStamp}.js`
		)
	)
	.listen(port, () => {
		console.log(`server started on http://${host}:${port}`);
	})
	.on("error", (error) => {
		console.error(`Server error: ${error.code}`);
	});
