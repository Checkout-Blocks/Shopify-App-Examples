import shopify from "@api-lib/shopify"
import sessionStorage from "@api-lib/sessionStorage";

// Offline auth token callback
export default async function handler(req, res) {
    try {
        const callback = await shopify.auth.callback({
            isOnline: false,
            rawRequest: req,
            rawResponse: res,
        });

        // Store offline session in Mongodb
        await sessionStorage.storeCallback(callback.session);
    } catch (error) {
        console.log(error)
    }

    res.redirect(`/api/auth?host=${req.query.host}&shop=${req.query.shop}`)
}