import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { api } from "@/lib/axios";

function handleInvalidLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
    console.log("its the middleware :)");
    console.log("url", request.url);

    const token = request.cookies.get("scramble.session_token");

    // try {
    //     await api.get(`${process.env.NEXT_PUBLIC_BACKEND_AUTH_PATH}/ping`, {
    //         headers: {
    //             Cookie: `scramble.session_token=${token!.value}`,
    //         },
    //     });
    // } catch (error) {
    //     // axios throws exception when response is 401
    //     const loginUrl = new URL("/login", request.url);
    //     loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    //     console.log("test");
    //     console.log(token);
    //     console.log(error);
    //     return NextResponse.redirect(loginUrl);
    // }

    if (token == undefined) {
        return handleInvalidLogin(request);
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_AUTH_PATH}/ping`;

    console.log(url);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Cookie: `scramble.session_token=${token!.value}`,
        },
    });

    if (!res.ok) {
        return handleInvalidLogin(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create"],
    // runtime: "nodejs", // need this for axios i believe
};
