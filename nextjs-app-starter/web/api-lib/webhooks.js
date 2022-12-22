// json examples here https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks
// https://github.com/Shopify/shopify-api-node/blob/shopify_api_next/docs/usage/webhooks.md
export const webhooks = {
    // GDPR - HTTP
    "CUSTOMERS_DATA_REQUEST": {
      path: "/webhooks",
      webhookHandler: processCustomersDataRequest,
    },
    "CUSTOMERS_REDACT": {
      path: "/webhooks",
      webhookHandler: processCustomersRedact,
    },
    "SHOP_REDACT": {
      path: "/webhooks",
      webhookHandler: processShopRedact,
    },
  }
  
  /**
   * customers/data_request
   * 
   * > Learn more: https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   * > Respond with any customer data store on your system. The `customer_id` is provided in payload.
   */
  async function processCustomersDataRequest(topic, shop, body) {
    try {
      const {
        shop_domain,
        customer: {
          id,
          email,
        },
        orders_requested,
      } = JSON.parse(body)
      // log event or send an email notification
    } catch (e) {
      console.error(e)
    }
  }
  
  /**
   * customers/redact
   * 
   * > Delete data stored on a customer. The `customer_id` is provided in payload.
   * > Learn more: https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  async function processCustomersRedact(topic, shop, body) {
    try {
      const {
        shop_domain,
        customer: {
          id,
          email,
        },
        orders_to_redact,
      } = JSON.parse(body)
      // log event or send an email notification
    } catch (e) {
      console.error(e)
    }
  }
    
  /**
   * shop/redact
   * 
   * > Erase store specific data
   *  > Learn more: https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  async function processShopRedact(topic, shop, body) {
    try {
      const { shop_domain } = JSON.parse(body)
      // log event or send an email notification
    } catch (e) {
      console.error(e)
    }
  }