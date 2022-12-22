import shopify from "@api-lib/shopify";
import sessionStorage from "@api-lib/sessionStorage";
import { fetchMongodb } from "@api-lib/mongodb";
import AnalyticsClient from "@api-lib/segmentAnalytics";
import { GET_SHOP_DATA } from "@api-lib/graphqlQueries";

// Online auth token callback
export default async function handler(request, response) {
    try {        
        const mongodb = await fetchMongodb();

        const callback = await shopify.auth.callback({
            isOnline: true,
            rawRequest: request,
            rawResponse: response,
        });

        const session = callback.session;
        const shop = session.shop;

        // Store online auth in Mongo
        await sessionStorage.storeCallback(session);

        let fetchShopData = true;
        let authEventType = null;

        // Check if shop exists
        const shopDoc = await mongodb.collection("shops").findOne({
            shop,
        });
        if (!shopDoc) {
            authEventType = "install";

            // This shop has never been installed
            await mongodb.collection("shops").insertOne({
                shopId: null, // TODO:
                shop: shop,
                scopes: session.scope,
                isInstalled: true,
                subscription: {},
                settings: {},
                installedAt: new Date(),
                uninstalledAt: null,
            });
        } else if (!shopDoc.isInstalled) {
            authEventType = "reinstall";

            // This is a REINSTALL
            await mongodb.collection("shops").updateOne(
                {
                    shop,
                },
                {
                    $set: {
                        scopes: session.scope,
                        subscription: {},
                        isInstalled: true,
                        installedAt: new Date(),
                        uninstalledAt: null,
                    },
                }
            );
        } else {
            authEventType = "reauth";

            if (shopDoc.shopData) {
                fetchShopData = false;
            }
      
            // Update scopes
            await mongodb.collection("shops").updateOne(
                {
                    shop,
                },
                {
                    $set: {
                        scopes: session.scope,
                    },
                }
            );
        }

        if (authEventType && AnalyticsClient) {
            AnalyticsClient.track({
                event: authEventType,
                userId: shop, // TODO: switch to user??
                workspace_slug: shop,
            });
        }

        if (fetchShopData) {
            const sessionId = await shopify.session.getOfflineId(shop);
            const offlineSession = await sessionStorage.loadCallback(sessionId)    
            
            // Create Shopify GraphQL Api Client
            const client = new shopify.clients.Graphql({
                session: offlineSession
            });
        
            // Set the shopData on the store during initial auth
            const apiRes = await client.query({ data: GET_SHOP_DATA });
        
            // Check if data response was successful
            if (!apiRes?.body?.data?.shop) {
                console.warn(`Missing shop data on ${shop}`, apiRes?.body);
            } else {
                const shopData = {
                    ...apiRes.body.data.shop,
                    shopLocales: apiRes.body.data.shopLocales,
                };
        
                // Save shopData to shop document
                await mongodb.collection("shops").updateOne(
                    {
                        shop: shop,
                    },
                    {
                        $set: {
                            shopId: shopData.id,
                            shopData,
                        },
                    }
                );
            }
        }
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
