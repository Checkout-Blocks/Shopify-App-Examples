// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { verifyAuth } from "@api-lib/verify-jwt-auth";

const GET_ABANDONED_CHECKOUT = `
    query($id: ID!) {
        node(id: $id) {
            id
            ...on AbandonedCheckout {
                id
                abandonedCheckoutUrl

            }
        }
    }
`;

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

        // Retrieve abandoned checkout with id
        // const checkout = await client.graphql.query({
        //     data: {
        //         query: GET_ABANDONED_CHECKOUT,
        //         variables: {
        //             id: `gid://shopify/AbandonedCheckout/${id}`
        //         },
        //     },
        // });

        // Hat tip to Marc Baumbach at Seguno for this apprach
        const checkouts = await client.rest.get({
            path: `checkouts.json`,
            query: {
                since_id: id - 1,
                limit: 1,
            },
        });
        const checkout = checkouts?.body?.checkouts[0];

        // Create payload for draft order based on abandoned checkout id
        const draftOrderPayload = {};

        // 3. Create new draft order

        // Return id of draft order
        const draftOrderId = null; // TODO:

        res.status(200).json({ success: true, id: draftOrderId });
    } catch (error) {
        console.warn(error);
        console.warn(error?.response?.errors);
        res.status(500).json();
    }
}
