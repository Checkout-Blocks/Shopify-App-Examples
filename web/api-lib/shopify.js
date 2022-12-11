import "@shopify/shopify-api/adapters/node";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
  scopes: process.env.SCOPES.split(','),
  hostName: process.env.HOST.replace(/https:\/\//, ""),
  isEmbeddedApp: true,
  apiVersion: ApiVersion.October22,
});

export default shopify;