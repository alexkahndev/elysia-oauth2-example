import jwt from 'jsonwebtoken';
import { AuthHandler } from "../types/authTypes";

export const authGoogle = ({ oauth2 }: AuthHandler) => oauth2.redirect("Google", {
    scope: [
        "openid",
        "email",
        "profile",
    ],
});

export const authGoogleCallback = async ({
    oauth2,
    cookie,
    error,
    redirect
}: AuthHandler) => {
    try {
        const token = await oauth2.authorize("Google");

        const idToken = token.idToken;
        const accessToken = token.accessToken;

        const decoded = jwt.decode(idToken) as { [key: string]: any };

        console.log("Decoded token:", decoded);

        const userSub = decoded.sub;

        const redirectUrl = cookie.redirectUrl.value || "/";

        cookie.authToken.value = token;
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