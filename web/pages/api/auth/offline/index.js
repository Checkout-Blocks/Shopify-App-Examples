import sessionStorage from "@api-lib/session-storage";
import shopify from "@api-lib/shopify";

// Begin offline auth token
export default async function handler(req, res) {
    try {
        const shop = shopify.utils.sanitizeShop(req.query.shop, true);

        if (!shop) {
            // Fallback to login
            res.redirect("/login");
        }

        const sessionId = await shopify.session.getOfflineId(shop);
        const session = await sessionStorage.loadCallback(sessionId);

        if (session) {
            // This shop is already installed, reinit online auth
            return res.redirect(
                `/api/auth?host=${req.query.host}&shop=${req.query.shop}`
            );
        }

        return shopify.auth.begin({
            shop,
            callbackPath: "/api/auth/offline/callback",
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });
    } catch (e) {
        console.warn(e);
        res.redirect("/login?error=true");
    }
}
