import { eq } from "drizzle-orm";
import { dbType, schemaType } from "../server";

type UserFunctionProps = {
	authSub: string;
	db: dbType;
	schema: schemaType;
};

type NewUser = {
	authSub: string;
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
			email,
			given_name: givenName,
			family_name: familyName
		})
		.returning();

	return newUser[0];
};
