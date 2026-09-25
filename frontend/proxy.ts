import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isDashboardPage = pathname.startsWith("/dashboard");

    if (isDashboardPage) {
        if (!accessToken && !refreshToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (!accessToken && refreshToken) {
            try {
                const refreshResponse = await fetch(
                    `${API_URL}/api/auth/refresh`,
                    {
                        method: "POST",
                        headers: {
                            Cookie: `refreshToken=${refreshToken}`,
                        },
                    }
                );

                if (!refreshResponse.ok) {
                    return NextResponse.redirect(
                        new URL("/login", request.url)
                    );
                }

                const response = NextResponse.next();

                const setCookies = refreshResponse.headers.getSetCookie();

                for (const cookie of setCookies) {
                    response.headers.append("Set-Cookie", cookie);
                }

                return response;
            } catch {
                return NextResponse.redirect(
                    new URL("/login", request.url)
                );
            }
        }
    }

    if (isAuthPage && (accessToken || refreshToken)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};