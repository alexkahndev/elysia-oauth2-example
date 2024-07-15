import { Context } from "elysia";
import { dbType, schemaType } from "../server";
import { eq } from "drizzle-orm";

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

export const handleSetRedirect = ({ request, cookie }: Context) => {
	const url = request.headers.get("Referer");
	cookie.redirectUrl.value = url;

	return new Response(null, {
		status: 204
	});
};

export const handleLogout = async ({ cookie }: Context) => {
	const accessToken = cookie.googleAuthToken.value?.accessToken;

	if (accessToken) {
		try {
			await revokeGoogleToken(accessToken);
		} catch (error) {
			if (error instanceof Error) {
				console.error("Failed to revoke token:", error.message);
			}
		}
	}

	cookie.googleAuthToken.remove();
	cookie.user.remove();
	cookie.redirectUrl.remove();

	return new Response(null, {
		status: 204
	});
};

export const handleAuthStatus = ({ cookie }: Context) => {
	const isLoggedIn = Boolean(cookie.user.value);
	return new Response(JSON.stringify({ isLoggedIn }), {
		headers: { "Content-Type": "application/json" }
	});
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

export const getUser = async ({
	authSub,
	db,
	schema
}: UserFunctionProps) => {
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
			event_games_sub: 1,
			auth_sub: authSub,
			email: "example@example.com"
		})
		.returning();

	return newUser[0];
};
