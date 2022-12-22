import shopify from "@api-lib/shopify";

export default async function handler(req, res) {
    try {
        // POST required
        if (req.method !== "POST") {
            return res.status(403).send("Invalid method. POST required.");
        }

        // Process webhooks (GDPR)
        await shopify.webhooks.process(req, res);
        console.log(`Webhook processed, returned status code 200`);
      } catch (error) {
        console.log(`Failed to process webhook: ${error}`);
        res.status(401).send(error.message);
      }
}

export const config = {
    api: {
        bodyParser: false,
    },
}
