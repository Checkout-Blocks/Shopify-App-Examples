import { verifyAuth } from '@api-lib/verify-auth';
import db from '@api-lib/db';

export default async function handler(request, response) {
    const { session, shop } = await verifyAuth(request, response);
    
    const { createHmac } = await import('node:crypto');

    try {
        if (request.method !== "GET") {
            throw `Method ${request.method} not allowed`
        }

        // Fetch shopDoc
        const shopDoc = await db.shop.get(shop);
        if (!shopDoc) {
            throw `Can't find shop of ${shop}`;
        }

        // Get current admin user
        const email = session?.onlineAccessInfo?.associated_user?.email || "";
        const firstName = session?.onlineAccessInfo?.associated_user?.first_name || "";
        const lastName = session?.onlineAccessInfo?.associated_user?.last_name || "";
        const scopes = session?.onlineAccessInfo?.associated_user_scope;

        // Generate Helpscout Signature for Secure Mode
        // Learn more: https://developer.helpscout.com/beacon-2/web/secure-mode/
        const helpscoutSignature = process.env.HELPSCOUT_SECURE_KEY 
            ? createHmac("sha256", process.env.HELPSCOUT_SECURE_KEY)
                .update(email)
                .digest("hex")
            : null;

        return response.status(200).json({
            // Secure helpscout key for historical messages
            helpscoutSignature: helpscoutSignature,
            // App settings which are saved to store metafield
            settings: shopDoc.settings || {},
            // Enable app features only to this store
            featureFlags: shopDoc.featureFlags || null,
            // Shopify information
            shop: shop,
            name: shopDoc.shopData?.name || null,
            scopes: shopDoc.scopes,
            currencyCode: shopDoc.shopData?.currencyCode || null,
            shopLocales: shopDoc.shopData?.shopLocales || null,
            primaryLocale: shopDoc.shopData?.shopLocales.find(locale => locale.primary)?.locale || null,
            primaryDomain: shopDoc.shopData?.primaryDomain?.url || null,
            shopifyPlan: shopDoc.shopData?.plan || null,
            // Billing plan and subscription information
            hasDiscountCode: shopDoc.discountCode ? true : false,
            hasSubscribed: shopDoc.hasSubscribed ? true : false,
            subscription: shopDoc.subscription
                ? {
                    active: true,
                    planKey: shopDoc.subscription.planKey,
                    plan: shopDoc.subscription.plan,
                    updatedAt: shopDoc.subscription.upgradedAt,
                    interval: shopDoc.subscription.interval,
                    price: shopDoc.subscription.price,
                    priceMonthly: shopDoc.subscription.priceMonthly,
                    discount: shopDoc.subscription.discount,
                    orderLimit: shopDoc.subscription.orderLimit,
                    features: shopDoc.subscription.features
                }
                : null,
            // Online user
            user: {
                email,
                firstName,
                lastName,
                scopes
            },
            // Onboarding (guides, banners)
            onboarding: shopDoc.onboarding || null,
        });
    } catch (err) {
        console.warn(`${request.method} api/admin/shop`, err);

        return response.status(500).json({
            error: "TODO:"
        })
    }
};