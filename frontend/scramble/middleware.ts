import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { api } from "@/lib/axios";

function handleInvalidLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
    const allCookies = request.headers.get("cookie");

    if (allCookies == null) {
        return handleInvalidLogin(request);
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_AUTH_PATH}/ping`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Cookie: allCookies,
        },
    });

    if (!res.ok) {
        return handleInvalidLogin(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create"],
};
