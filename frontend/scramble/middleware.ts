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

    const url = process.env.NEXT_PUBLIC_MIDDLEWARE_AUTH!;

    console.log("inthe middleware");
    console.log("Fetching auth status from ", url);

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Cookie: allCookies,
        },
    });

    if (!res.ok) {
        console.log("Auth check failed", res.status, res.statusText);
        console.log("text", await res.text());
        console.log("json", await res.json());
        return handleInvalidLogin(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create"],
};
