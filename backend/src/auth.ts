import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db/drizzle"; // your drizzle instance
import { user, session, account, verification } from "./db/schema";

import dotenv from "dotenv";
import path from "path";

const env = process.argv[2] || "dev";
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET!;
const frontendURL = process.env.FRONTEND_URL!;

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    telemetry: { enabled: false },

    secret: betterAuthSecret,
    tokenTransport: "both",
    socialProviders: {
        google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        },
    },

    trustedOrigins: [frontendURL],
    advanced: {
        cookiePrefix: "scramble",
    },
});
