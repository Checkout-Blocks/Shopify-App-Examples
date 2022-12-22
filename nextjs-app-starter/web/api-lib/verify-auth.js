import sessionStorage from "@api-lib/sessionStorage";
import shopify from "@api-lib/shopify";

export const verifyAuth = async (request, response) => {
    try {
        const currentSessionId = await shopify.session.getCurrentId({
            isOnline: true,
            rawRequest: request,
            rawResponse: response,
        });
        
        if (!currentSessionId) {
            throw `No currentSessionId`
        }

        const session = await sessionStorage.loadCallback(currentSessionId);
        
        if (!session) {
            throw `No session found`
        }

        return {
            session: session || null,
            shop: session.shop,
            shopify,
            client: {
                rest: new shopify.clients.Rest({
                    session
                }),
                graphql: new shopify.clients.Graphql({
                    session
                }),
            }
        }
    } catch (error) {
        return response.status(401).json();
    }
}