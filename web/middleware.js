import { NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api/auth routes
         * 2. /api/webhooks routes
         * 3. /_next (Next.js internals)
         * 4. /_static (inside /public)
         * 5. /_vercel (Vercel internals)
         * 6. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/auth|api/webhooks|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
    ],
};

export async function middleware(request) {
    const response = NextResponse.next();
    const urlParams = new URLSearchParams(request.url.split("?")[1]);
    const query = Object.fromEntries(urlParams);

    /**
     * Redirect root to login page when not embedded
     *  */
    if (!query.embedded) {
        // Add security headers for root and login
        // TODO: we probably need this on all page routes?
        if (
            request.nextUrl.pathname === "/" ||
            request.nextUrl.pathname === "/login"
        ) {
            response.headers.append(
                "Content-Security-Policy",
                `frame-ancestors 'none';`
            );
        }

        if (request.nextUrl.pathname === "/") {
            return NextResponse.redirect(`${process.env.HOST}/login`, 303);
        }
    }

    return response;
}
