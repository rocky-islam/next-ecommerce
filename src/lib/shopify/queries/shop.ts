export const GET_SHOP_QUERY = `
  query GetShop {
    shop {
      name
      description
      primaryDomain {
        url
      }
      shipsToCountries
      paymentSettings {
        currencyCode
        enabledPresentmentCurrencies
      }
    }
  }
`;
