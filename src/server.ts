import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { renderToReadableStream } from "react-dom/server.browser";
import { swagger } from "@elysiajs/swagger";
import { createElement } from "react";
import { Home } from "./pages/Home";
import { ClientPortal } from "./pages/ClientPortal";
import { oauth2 } from "elysia-oauth2";
import { build } from "./build";
import { authGoogle, authGoogleCallback } from "./handlers/googleAuthHandlers";

const host = Bun.env.HOST || "localhost";
const port = Bun.env.PORT || 3000;

if (
    !Bun.env.GOOGLE_CLIENT_ID ||
    !Bun.env.GOOGLE_CLIENT_SECRET ||
    !Bun.env.GOOGLE_REDIRECT_URI
) {
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

async function revokeGoogleToken(accessToken: string) {
    const response = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to revoke token');
    }
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
    .get("/auth/google", authGoogle)
    .get("/auth/google/callback", authGoogleCallback)
    .get("/portal", () =>
        handleRequest(
            ClientPortal,
            `indexes/ClientPortalIndex.${buildTimeStamp}.js`
        )
    )
    .post("/set-redirect-url", ({ request, cookie }) => {
        const url = request.headers.get("Referer");
        cookie.redirectUrl.value = url;

        return new Response(null, {
            status: 204
        });
    })
    .post("/logout", async ({ cookie }) => {
        const accessToken = cookie.authToken.value?.accessToken;

        if (accessToken) {
            try {
                await revokeGoogleToken(accessToken);
            } catch (error) {
				if (error instanceof Error) {
                console.error("Failed to revoke token:", error.message);
				}}
        }

        cookie.authToken.remove();
        cookie.redirectUrl.remove();

        return new Response(null, {
            status: 204
        });
    })
    .get("/auth-status", ({ cookie }) => {
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
