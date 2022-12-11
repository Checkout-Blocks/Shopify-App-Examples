// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { verifyAuth } from "@api-lib/verify-jwt-auth";

export default async function handler(req, res) {
    const auth = await verifyAuth(req, res);
    const { session, shop } = auth;

    console.log("shop", shop);

    // 1. Retrieve abandoned checkout with id

    // 2. Create payload for draft order based on abandoned checkout id

    // 3. Craft new draft order

    // 4. Return id of draft order

    res.status(200).json({ success: true, id: null });
}
