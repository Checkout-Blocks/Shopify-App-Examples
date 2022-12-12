import shopify from "@api-lib/shopify";
import sessionStorage from "@api-lib/session-storage";

// Offline auth token callback
export default async function handler(req, res) {
    try {
        const callback = await shopify.auth.callback({
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });

        // Store offline session
        const shop = shopify.utils.sanitizeShop(req.query.shop, true);
        const sessionId = await shopify.session.getOfflineId(shop);
        await sessionStorage.storeCallback(sessionId, callback.session);
    } catch (error) {
        console.log(error);
    }

    res.redirect(`/api/auth?host=${req.query.host}&shop=${req.query.shop}`);
}
