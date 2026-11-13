
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const protectedRoutes = [
        "/add-books",
        "/my-books",
        "/myBorrow",
    ];

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route ||
            pathname.startsWith(`${route}/`)
    );

    if (!isProtectedRoute) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
        const loginUrl = new URL(
            "/Authentication/signin",
            request.url
        );

        loginUrl.searchParams.set(
            "callbackUrl",
            pathname + search
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/add-books/:path*",
        "/my-books/:path*",
        "/myBorrow/:path*",
    ],
};
