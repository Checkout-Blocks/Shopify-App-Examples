// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { CREATE_DRAFT_ORDER } from "@api-lib/graphql-queries";
import { constructDraftOrder } from "@api-lib/helper";
import { verifyAuth } from "@api-lib/verify-jwt-auth";

export default async function handler(req, res) {
    const auth = await verifyAuth(req, res);

    try {
        if (req.method !== "GET") {
            throw `request method now allowed`;
        }

        const { shop, client } = auth;
        const { id } = req.query;

        if (!id) {
            throw `Missing required id query param`;
        }

        // Hat tip to Marc Baumbach at Seguno for this apprach
        const checkouts = await client.rest.get({
            path: `checkouts.json`,
            query: {
                since_id: id - 1,
                limit: 1,
            },
        });
        const checkout = checkouts?.body?.checkouts[0];

        // Create draft order payload
        const draftOrderPayload = constructDraftOrder(checkout);

        // Create new draft order
        const draftOrderResponse = await client.graphql.query({
            data: {
                query: CREATE_DRAFT_ORDER,
                variables: {
                    input: draftOrderPayload,
                },
            },
        });
        
        // Return id of draft order
        const draftOrderId =
            draftOrderResponse?.body?.data?.draftOrderCreate?.draftOrder?.legacyResourceId ||
            null;

        res.status(200).json({ success: true, id: draftOrderId });
    } catch (error) {
        console.warn(error);
        console.warn(error?.response?.errors);
        res.status(500).json();
    }
}
