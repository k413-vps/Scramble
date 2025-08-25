import { createAuthClient } from "better-auth/react";

const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`!;

const authClient = createAuthClient({
    baseURL: backendURL,
});

export default authClient;
