import Elysia from "elysia";
import { oauth2 } from "elysia-oauth2";
import { dbType, schemaType } from "../server";
import { getUser, createUser } from "../handlers/userHandlers";
import  jwt  from "jsonwebtoken";

type GoogleAuthPluginProps = {
    db: dbType;
    schema: schemaType;
};

export const googleAuthPlugin = ({db, schema}: GoogleAuthPluginProps) => {
    if (
        !process.env.GOOGLE_CLIENT_ID ||
        !process.env.GOOGLE_CLIENT_SECRET ||
        !process.env.GOOGLE_REDIRECT_URI
    ) {
        throw new Error("Google OAuth2 credentials are not set in .env file");
    }

    return new Elysia()
        .decorate({
            db,
            schema
        })
        .use(
            oauth2({
                Google: [
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    process.env.GOOGLE_REDIRECT_URI
                ]
            })
        )
        .get("/auth/google", async ({ oauth2 }) => {
            return await oauth2.redirect("Google", {
                scopes: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email"
                ]
            });
        })
        .get("/auth/google/callback", async ({ oauth2, cookie, error, redirect }) => {
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
                    sameSite: "strict"
                });

                return redirect(redirectUrl);
            } catch (err) {
                if (err instanceof Error) {
                    console.error("Failed to authorize Google:", err.message);
                }

                return error(500);
            }
        })
};
