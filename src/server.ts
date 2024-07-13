import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server.browser";
import { swagger } from "@elysiajs/swagger";
import { createElement } from "react";
import { Home } from "./pages/Home";
import { ClientPortal } from "./pages/ClientPortal";
import { oauth2 } from "elysia-oauth2";
import { build } from "./build";

const host = Bun.env.HOST || "localhost";
const port = Bun.env.PORT || 3000;

if (!Bun.env.GOOGLE_CLIENT_ID || !Bun.env.GOOGLE_CLIENT_SECRET || !Bun.env.GOOGLE_REDIRECT_URI) {
    console.error("Google OAuth2 credentials are missing");
    process.exit(1);
}

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
    )
    .get("/", () =>
        handleRequest(Home, `indexes/HomeIndex.${buildTimeStamp}.js`)
    )
    .get("/auth/google", ({ oauth2 }) => oauth2.redirect("Google"))
    .get("/auth/google/callback", async ({ oauth2, cookie }) => {
        const token = await oauth2.authorize("Google");
        const redirectUrl = cookie.redirectUrl.value || "/";

        cookie.authToken.value = token;

        cookie.redirectUrl.remove();

        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectUrl
            }
        });
    })
    .get("/portal", () =>
        handleRequest(
            ClientPortal,
            `indexes/ClientPortalIndex.${buildTimeStamp}.js`
        )
    )
    .post("/set-redirect-url", ({ request, cookie }) => {
        const url = request.headers.get("Referer");
        cookie.redirectUrl.value = url;

        return new Response("OK");
    })
    .post("/api/logout", ({ cookie }) => {
        cookie.authToken.remove();
        return new Response("OK");
    })
	.get("/api/auth-status", ({ cookie }) => {
		const isLoggedIn = Boolean(cookie.authToken.value);
		return new Response(JSON.stringify({ isLoggedIn }), {
			headers: { "Content-Type": "application/json" }
		});
	})	
    .listen(port, () => {
        console.log(`server started on http://${host}:${port}`);
    })
    .on("error", (error) => {
        console.error(`Server error: ${error.code}`);
    });
