import shopify from "@api-lib/shopify";
import sessionStorage from "@api-lib/session-storage";

// Online auth token callback
export default async function handler(request, response) {
    try {
        const callback = await shopify.auth.callback({
            isOnline: true,
            rawRequest: request,
            rawResponse: response,
        });

        const session = callback.session;
        const shop = session.shop;

        // Store online auth in Redis
        await sessionStorage.storeCallback(session.id, session);

    } catch (error) {
        console.warn(error);
    }

    // Get embedded app url for redirection
    const redirectUrl = await shopify.auth.getEmbeddedAppUrl({
        rawRequest: request,
        rawResponse: response,
    });

    // Redirect to embedded app inside shop
    return response.redirect(302, redirectUrl);
}
