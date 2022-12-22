import sessionStorage from "@api-lib/sessionStorage";
import shopify from "@api-lib/shopify";

// Begin online auth token
export default async function handler(req, res) {
    const shop = shopify.utils.sanitizeShop(req.query.shop, true)
    
    if (!shop) {
        res.redirect('/login')
    }

    try {
        const sessionId = await shopify.session.getOfflineId(shop);
        const session = await sessionStorage.loadCallback(sessionId)

        if (!session) {
            // This shop is missing offline session, redirect to offline
            return res.redirect(`/api/auth/offline?host=${req.query.host}&shop=${req.query.shop}`);
        }
        
        return shopify.auth.begin({
            shop,
            callbackPath: '/api/auth/callback',
            isOnline: true,
            rawRequest: req,
            rawResponse: res,
        })
    } catch (e) {
        console.warn(e)
    }

    // Fallback to login
    res.redirect(`/login?shop=${shop}`)
}