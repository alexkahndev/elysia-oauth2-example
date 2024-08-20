import { AppContext } from "../server";

export const authApp = async ({ cookie, error, redirect }: AppContext) => {
	try {
		console.log("authApp");
	} catch (err) {
		if (err instanceof Error) {
			console.error("Authorization failed:", err.message);
		} else {
			console.error("Unknown error:", err);
			return error(500, "Internal Server Error");
		}
	}
};
