import jwt from "jsonwebtoken";
import Elysia from "elysia";
import { googleAuthPlugin } from "./googleAuthPlugin";
import { dbType, schemaType } from "../server";

async function revokeGoogleToken(accessToken: string) {
	const response = await fetch(
		`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`,
		{
			method: "POST",
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		}
	);

	if (!response.ok) {
		throw new Error("Failed to revoke token");
	}
}

type AbsoluteAuthPluginProps = {
    db: dbType;
	schema: schemaType;
};

export const absoluteAuthPlugin = ({db,schema}: AbsoluteAuthPluginProps) => {
	return new Elysia()
        .use(googleAuthPlugin({ db, schema }))
		.post("/set-redirect-url", ({ request, cookie }) => {
			const url = request.headers.get("Referer") || "/";

			cookie.redirectUrl.set({
				value: url,
				secure: true,
				httpOnly: true,
				sameSite: "lax",
				path: "/"
			});

			return new Response(null, {
				status: 204
			});
		})
		.post("/logout", async ({ cookie }) => {
			const accessToken = cookie.userAccessToken.value;

			if (accessToken) {
				try {
					await revokeGoogleToken(accessToken);
					cookie.userAccessToken.remove();
				} catch (error) {
					if (error instanceof Error) {
						console.error("Failed to revoke token:", error.message);
					}
				}
			}

			cookie.redirectUrl.remove();

			return new Response(null, {
				status: 204
			});
		})
		.get("/auth-status", ({ cookie }) => {
			const isLoggedIn = Boolean(cookie.userAccessToken.value);

			const userIdToken = cookie.userIdToken.value;

			let givenName = "";
			let familyName = "";
			let email = "";
			let picture = "";

			if (userIdToken) {
				const decoded = jwt.decode(userIdToken) as {
					[key: string]: any;
				};

				givenName = decoded.given_name;
				familyName = decoded.family_name;
				email = decoded.email;
				picture = decoded.picture;
			}

			return new Response(
				JSON.stringify({
					isLoggedIn,
					givenName,
					familyName,
					email,
					picture
				}),
				{
					headers: {
						"Content-Type": "application/json"
					}
				}
			);
		});
};
