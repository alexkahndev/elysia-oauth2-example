import jwt from "jsonwebtoken";
import { AuthContext } from "../server";
import { createUser, getUser } from "./userHandlers";

export const authGoogle = async ({ oauth2 }: AuthContext) => {
	return await oauth2.redirect("Google", {
		scopes: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email"
		]
	});
};

export const authGoogleCallback = async ({
	oauth2,
	cookie,
	db,
	schema,
	error,
	redirect
}: AuthContext) => {
	try {
		const token = await oauth2.authorize("Google");

		const idToken = token.idToken;

		const decoded = jwt.decode(idToken) as { [key: string]: any };

		const provider = "google";
		const authSub = `${provider}|${decoded.sub}`;
		const givenName = decoded.given_name;
		const familyName = decoded.family_name;
		const email = decoded.email;

		let user = await getUser({
			authSub,
			db,
			schema
		});

		if (user === null) {
			user = await createUser({
				authSub,
				givenName,
				familyName,
				email,
				db,
				schema
			});
		}

		const redirectUrl = cookie.redirectUrl.value || "/";

		cookie.userAccessToken.set({
			value: token.accessToken,
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			path: "/"
		});

		cookie.userRefreshToken.set({
			value: token.refreshToken,
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			path: "/"
		});

		cookie.userIdToken.set({
			value: idToken,
			secure: true,
			httpOnly: true,
			sameSite: "strict",
			path: "/"
		});

		cookie.redirectUrl.remove();

		return redirect(redirectUrl);
	} catch (err) {
		if (err instanceof Error) {
			console.error("Authorization failed:", err.message);

			if (err.message.includes("state mismatch")) {
				return error(400, "Bad Request: State mismatch");
			} else if (err.message.includes("codeVerifier")) {
				return error(400, "Bad Request: Code verifier error");
			} else if (err.message.includes("invalid_grant")) {
				return error(401, "Unauthorized: Invalid grant");
			} else if (err.message.includes("invalid_client")) {
				return error(401, "Unauthorized: Invalid client");
			} else if (err.message.includes("access_denied")) {
				return error(403, "Forbidden: Access denied");
			}
		} else {
			console.error("Unknown error:", err);
			return error(500, "Internal Server Error");
		}
	}
};

export async function revokeGoogleToken(accessToken: string) {
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
