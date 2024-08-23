import jwt from "jsonwebtoken";
import Elysia from "elysia";
import { googleAuthPlugin } from "./googleAuthPlugin";
import { dbType, schemaType } from "../server";
import { appAuthPlugin } from "./appAuthPlugin";

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

export const absoluteAuthPlugin = ({ db, schema }: AbsoluteAuthPluginProps) => {
	return new Elysia()
		.use(googleAuthPlugin({ db, schema }))
		.use(appAuthPlugin({ db, schema }))
		.post("/set-redirect-url", ({ request, cookie: { redirectUrl } }) => {
			const url = request.headers.get("Referer") || "/";

			redirectUrl.set({
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
		.post(
			"/logout",
			async ({ cookie: { userAccessToken, redirectUrl } }) => {
				const accessToken = userAccessToken.value;

				if (accessToken) {
					try {
						await revokeGoogleToken(accessToken);
						userAccessToken.remove();
					} catch (error) {
						if (error instanceof Error) {
							console.error(
								"Failed to revoke token:",
								error.message
							);
						}
					}
				}

				redirectUrl.remove();

				return new Response(null, {
					status: 204
				});
			}
		)
		.get("/auth-status", ({ cookie: { userAccessToken } }) => {
			const isLoggedIn = Boolean(userAccessToken.value);

			let givenName = "";
			let familyName = "";
			let email = "";
			let picture = "";

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
