import _ from 'lodash';

const getCoinCapToken = _.memoize(tokenSymbol =>
  fetch(`https://api.coincap.io/v2/assets/${tokenSymbol}`).then(res =>
    res.json(),
  ),
);

export function getDockTokenPrice() {
  try {
    const {data} = await getCoinCapToken('dock');

    return parseFloat(data.priceUsd);
  } catch (err) {
    console.error(err);
    return 0;
  }
}
