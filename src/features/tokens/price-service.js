import memoize from 'lodash.memoize';

const getCoinCapToken = memoize(tokenSymbol =>
  fetch(`https://api.coincap.io/v2/assets/${tokenSymbol}`).then(res =>
    res.json(),
  ),
);

export async function getDockTokenPrice() {
  try {
    const {data} = await getCoinCapToken('dock');
    return parseFloat(data.priceUsd);
  } catch (err) {
    console.error(err);
    return 0;
  }
}
