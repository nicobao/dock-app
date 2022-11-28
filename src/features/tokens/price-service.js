import {getRealm} from '@docknetwork/wallet-sdk-core/lib/core/realm';
import axios from '../../core/network-service';

const tokenPrices = {};

export const emptyResponse = {
  priceUsd: 0,
};

export const getCoinCapToken = async tokenSymbol => {
  try {
    const {data: res} = await axios.get(
      `https://api.coincap.io/v2/assets/${tokenSymbol}`,
    );

    const {data} = res;

    return {
      priceUsd: data.priceUsd,
    };
  } catch (e) {
    return emptyResponse;
  }
};

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

  if (cachedPrice && cachedPrice.price > 0) {
    return cachedPrice.price;
  }

  return networkResult;
}

export async function getDockTokenPrice() {
  return getTokenPrice('DOCK');
}
