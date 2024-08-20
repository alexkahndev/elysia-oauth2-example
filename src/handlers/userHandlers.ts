import { Context } from "elysia";
import { dbType, schemaType } from "../server";
import { eq } from "drizzle-orm";
import { revokeGoogleToken } from "./googleAuthHandlers";
import jwt from "jsonwebtoken";

export const handleSetRedirect = ({ request, cookie }: Context) => {
	const url = request.headers.get("Referer") || "/";

	cookie.redirectUrl.set({
		value: url,
		secure: true,
		httpOnly: true,
		sameSite: "lax", // allows for top-level navigation for ouath flow
		path: "/"
	});

	return new Response(null, {
		status: 204
	});
};

export const handleLogout = async ({ cookie }: Context) => {
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
};

export const handleAuthStatus = ({ cookie }: Context) => {
	const isLoggedIn = Boolean(cookie.userAccessToken.value);

	const userIdToken = cookie.userIdToken.value;

	let givenName = "";
	let familyName = "";
	let email = "";
	let picture = "";

	if (userIdToken) {
		const decoded = jwt.decode(userIdToken) as { [key: string]: any };

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
			headers: { "Content-Type": "application/json" }
		}
	);
};

type UserFunctionProps = {
	authSub: string;
	db: dbType;
	schema: schemaType;
};

type NewUser = {
	authSub: string;
	event_games_sub: number;
	email: string;
	givenName: string;
	familyName: string;
};

export const getUser = async ({ authSub, db, schema }: UserFunctionProps) => {
	const user = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.auth_sub, authSub))
		.execute();

	if (user.length === 0) {
		return null;
	}

	return user[0];
};

export const createUser = async ({
	event_games_sub,
	authSub,
	givenName,
	familyName,
	email,
	db,
	schema
}: UserFunctionProps & NewUser) => {
	const newUser = await db
		.insert(schema.users)
		.values({
			auth_sub: authSub,
			event_games_sub,
			email,
			given_name: givenName,
			family_name: familyName
		})
		.returning();

	return newUser[0];
};
