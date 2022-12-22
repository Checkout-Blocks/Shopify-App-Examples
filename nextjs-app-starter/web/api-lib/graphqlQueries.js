export const GET_SHOP_DATA = `{
    shop {
      id
      name
      ianaTimezone
      email
      url
      currencyCode
      primaryDomain {
        url
        sslEnabled
      }
      billingAddress {
        country
        longitude
        latitude
      }
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
    }
    shopLocales {
      name
      locale
      primary
      published
    }
}`;