import { Elysia, t } from "elysia";
import { dbType, schemaType } from "../server";
import { jwt } from "@elysiajs/jwt";

type AppAuthPluginProps = {
	db: dbType;
	schema: schemaType;
};

export const appAuthPlugin = ({ db, schema }: AppAuthPluginProps) => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET is not set in .env file");
	}

	return new Elysia()
		.use(
			jwt({
				name: "appNamespace",
				secret: process.env.JWT_SECRET
			})
		)
		.post(
			"/auth/app/signup",
			// @ts-expect-error
			async ({ jwt, body }) => {
				const { email, password } = body;

				console.log("signed up", email, password);
			},
			{
				body: t.Object({
					email: t.String(),
					password: t.String()
				})
			}
		);
};
