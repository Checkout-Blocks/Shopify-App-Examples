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

    /**
     * iFrame Security headers
     * See: https://shopify.dev/apps/store/security/iframe-protection
     */
    if (query.embedded && shop) {
        response.headers.append(
            "Content-Security-Policy",
            `frame-ancestors https://${encodeURIComponent(
                shop
            )} https://admin.shopify.com;`
        );
    }

    /**
     * Verify-Request
     *
     * Make sure all admin api requests include a Bearer Token
     * */
    if (request.url.includes("/api/admin")) {
        const authorizationHeader = request.headers.get("authorization");

        // Make sure API request has required 'authorization' header (Bearer JWT)
        if (!authorizationHeader) {
            // No shop so respond with 401 and /login
            if (!shop) {
                return new NextResponse(
                    JSON.stringify({
                        success: false,
                        message: "authentication failed",
                    }),
                    {
                        status: 401,
                        headers: {
                            "content-type": "application/json",
                            "X-Shopify-API-Request-Failure-Reauthorize": "1",
                            "X-Shopify-API-Request-Failure-Reauthorize-Url": `/login`,
                        },
                    }
                );
            }

            // Respond with 401 and header
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "authentication failed",
                }),
                {
                    status: 401,
                    headers: {
                        "content-type": "application/json",
                        "X-Shopify-API-Request-Failure-Reauthorize": "1",
                        "X-Shopify-API-Request-Failure-Reauthorize-Url": `/api/auth?shop=${shop}`,
                    },
                }
            );
        }
        return response;
    }

    return response;
}
