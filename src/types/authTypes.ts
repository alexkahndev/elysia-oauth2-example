import { Context } from "elysia";

export type Oauth2Type = {
    createURL: (provider: "Google", ...options: any[]) => Promise<URL>;
    redirect: (provider: "Google", ...options: any[]) => Promise<void>;
    authorize: (provider: "Google", ...options: any[]) => Promise<{
        idToken: string;
        accessToken: string;
    }>;
    refresh: (provider: "Google", ...options: any[]) => Promise<any>;
};


export type AuthHandler = Context & {
	oauth2: Oauth2Type;
};