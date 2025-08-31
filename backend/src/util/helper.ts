import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";

import { Request } from "express";

export async function verifySession(req: Request): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    return session == null;
}
