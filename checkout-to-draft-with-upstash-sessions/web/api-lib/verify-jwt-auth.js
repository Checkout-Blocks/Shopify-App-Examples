import sessionStorage from "@api-lib/session-storage";
import shopify from "@api-lib/shopify";

export const verifyAuth = async (request, response) => {
    try {
        const currentSessionId = await shopify.session.getCurrentId({
            isOnline: true,
            rawRequest: request,
            rawResponse: response,
        });

        if (!currentSessionId) {
            throw `No currentSessionId`;
        }

        const onlineSession = await sessionStorage.loadCallback(
            currentSessionId
        );

        if (!onlineSession) {
            throw `No online session found`;
        }

        const offlineSessionId = await shopify.session.getOfflineId(
            onlineSession.shop
        );

        if (!offlineSessionId) {
            throw `No offlineSessionId`;
        }

        const offlineSession = await sessionStorage.loadCallback(
            offlineSessionId
        );

        if (!offlineSession) {
            throw `No offline session found`;
        }

        return {
            session: onlineSession || null,
            shop: onlineSession.shop,
            shopify,
            client: {
                rest: new shopify.clients.Rest({
                    session: offlineSession,
                }),
                graphql: new shopify.clients.Graphql({
                    session: offlineSession,
                }),
            },
        };
    } catch (error) {
        console.warn(error);
        return response.status(401).json();
    }
};
