import memoize from 'lodash.memoize';
import {getRealm} from 'src/core/realm';

const tokenPrices = {};

const getCoinCapToken = tokenSymbol =>
  fetch(`https://api.coincap.io/v2/assets/${tokenSymbol}`)
    .then(res => res.json())
    .then(res => res.data)
    .catch(err => ({
      priceUsd: 0,
    }));

function getTokenPrice(symbol) {
  const realm = getRealm();

  if (tokenPrices[symbol]) {
    return tokenPrices[symbol];
  }

  const fetchFromNetwork = async () => {
    const {priceUsd} = await getCoinCapToken('dock');
    const price = parseFloat(priceUsd) || 0;

    tokenPrices[symbol] = price;

    realm.write(() => {
      realm.create(
        'TokenPrice',
        {
          symbol: symbol,
          price: price,
        },
        'modified',
      );
    });

    return price;
  };

  const cachedPrice = realm
    .objects('TokenPrice')
    .filtered('symbol = $0', symbol)
    .toJSON()[0];
  const networkResult = fetchFromNetwork();

  if (cachedPrice) {
    return cachedPrice.price;
  }

  return networkResult;
}

export async function getDockTokenPrice() {
  return getTokenPrice('DOCK');
}
