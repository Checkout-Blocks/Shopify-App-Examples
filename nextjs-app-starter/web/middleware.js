import { NextResponse } from "next/server";

import shopify from "@api-lib/shopify";

export const config = {
	matcher: [
	  /*
	   * Match all paths except for:
	   * 1. /api/auth routes
	   * 2. /api/webhooks routes
	   * 5. /_next (Next.js internals)
	   * 6. /_proxy & /_auth (special pages for OG tag proxying and password protection)
	   * 7. /_static (inside /public)
	   * 8. /_vercel (Vercel internals)
	   * 9. all root files inside /public (e.g. /favicon.ico)
	   */
	  "/((?!api/auth|api/webhooks|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
	],
};

export async function middleware(request) {
	const response = NextResponse.next();
	const urlParams = new URLSearchParams(request.url.split("?")[1]);
	const query = Object.fromEntries(urlParams);
	let shop = null;

	if (query?.shop && query?.shop != "null" && query.shop != "undefined") {
		shop = shopify.utils.sanitizeShop(query.shop, true);
	} else if (request.headers.myshopify) {
		shop = request.headers.myshopify;
	}

	// Index
	if (request.nextUrl.pathname === "/") {
		const { hmac, host, shop, timestamp, session } = query;

		// If session is missing, let's login
		if (hmac && !session) {
			//const onlineAuthRoute = "/api/auth";
			//const verifyTokenUrl = `${process.env.HOST}/api/auth/verify-token`;
			const offlineAuthRoute = "/api/auth/offline";
			const fallbackRoute = "/login";
			
			// If no shop, then we must redirect to login
			if (!shop) {
				return NextResponse.redirect(
					`${process.env.HOST}${fallbackRoute}`,
					303
				);
			}

			return NextResponse.redirect(
				`${process.env.HOST}${offlineAuthRoute}?hmac=${hmac}&host=${encodeURIComponent(host)}&shop=${shop}&timestamp=${timestamp}`,
				303
			);
		} else {
			//console.log("session", session);
			// TODO: make API call to verify auth token
		}
	}

	/**
	 * Verify-Request 
	 * 
	 * Make sure all admin & graphql proxy api requests include a Bearer Token
	 * */ 
	if (request.url.includes("/api/admin") || request.url.includes("/api/graphql")) {
		// Billing callback is meant to be visited external of iframe without auth
		if (request.url.includes("/api/admin/billing/callback")) {
			return response;
		}

		const authorizationHeader = request.headers.get('authorization');
		
		// Make sure API request has required 'authorization' header (Bearer JWT)
		if (!authorizationHeader) {
			// No shop so respond with 401 and /login
			if (!shop) {
				return new NextResponse(
					JSON.stringify({ success: false, message: 'authentication failed' }),
					{ 
						status: 401, 
						headers: { 
							'content-type': 'application/json',
							'X-Shopify-API-Request-Failure-Reauthorize': '1',
							'X-Shopify-API-Request-Failure-Reauthorize-Url': `/login`
						}
					}
				) 
			}
		
			// Respond with 401 and header
			return new NextResponse(
				JSON.stringify({ success: false, message: 'authentication failed' }),
				{ 
					status: 401, 
					headers: { 
						'content-type': 'application/json',
						'X-Shopify-API-Request-Failure-Reauthorize': '1',
						'X-Shopify-API-Request-Failure-Reauthorize-Url': `/api/auth?shop=${shop}`
					}
				}
			)
		}
		return response;
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

		if (request.url.endsWith("/login")) {
			// TODO: redirect back to homepage as we should not be on /login
			//return NextResponse.redirect(`${process.env.HOST}/exit-iframe`, 303);
		}
	}
	
	/**
	 * Redirect root to login page when not embedded
	 *  */
	if (!query.embedded) {
		// Add security headers for root and login
		// TODO: we probably need this on all page routes?
		if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/login") {
			response.headers.append("Content-Security-Policy", `frame-ancestors 'none';`);
		}

		if (request.nextUrl.pathname === "/") {
			return NextResponse.redirect(`${process.env.HOST}/login`, 303);
		}
	}

	return response;
}