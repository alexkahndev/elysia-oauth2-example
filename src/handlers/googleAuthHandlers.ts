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
				event_games_sub: 1,
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
			httpOnly: true,
			secure: true, 
			path: "/", 
			sameSite: 'strict' 
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
