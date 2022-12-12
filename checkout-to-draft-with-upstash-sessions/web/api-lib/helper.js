export const constructDraftOrder = (checkout) => {
    if (!checkout) {
        return null;
    }

    return {
        //visibleToCustomer: true, // TODO: configurable
        tags: ["import-abandoned-cart"],
        purchasingEntity: {
            customerId: `gid://shopify/Customer/${checkout.customer?.id}`,
            //purchasingCompany: {} if b2b 
        },
        presentmentCurrencyCode: checkout.presentment_currency?.presentment_currency || checkout.currency?.currency,
        billingAddress: !checkout.billing_address
            ? {}
            : {
                  address1: checkout.billing_address.address1,
                  address2: checkout.billing_address.address2,
                  city: checkout.billing_address.city,
                  company: checkout.billing_address.company,
                  country: checkout.billing_address.country,
                  countryCode: checkout.billing_address.country_code,
                  firstName: checkout.billing_address.first_name,
                  lastName: checkout.billing_address.last_name,
                  phone: checkout.billing_address.phone,
                  province: checkout.billing_address.province,
                  provinceCode: checkout.billing_address.province_code,
                  zip: checkout.billing_address.zip,
              },
        customAttributes: [
            {
                key: "checkout_name",
                value: checkout.name,
            },
            // TODO:...checkout.note_attributes
        ],
        sourceName: checkout.source_name,
        email: checkout.email,
        lineItems: checkout.line_items.map((line) => ({
            // TODO: Double check any missing fields
            variantId: `gid://shopify/ProductVariant/${line.variant_id}`,
            quantity: line.quantity,
            customAttributes: !line.properties?.length
                ? null
                : line.properties.map((property) => ({
                      key: Object.keys(property)[0],
                      value: Object.values(property)[0],
                  })),
        })),
        note: checkout.note,
        shippingAddress: !checkout.shipping_address
            ? {}
            : {
                  address1: checkout.shipping_address.address1,
                  address2: checkout.shipping_address.address2,
                  city: checkout.shipping_address.city,
                  company: checkout.shipping_address.company,
                  country: checkout.shipping_address.country,
                  countryCode: checkout.shipping_address.country_code,
                  firstName: checkout.shipping_address.first_name,
                  lastName: checkout.shipping_address.last_name,
                  phone: checkout.shipping_address.phone,
                  province: checkout.shipping_address.province,
                  provinceCode: checkout.shipping_address.province_code,
                  zip: checkout.shipping_address.zip,
              },
    };
};
