const SUBSCAN_URL = 'https://dock.api.subscan.io';
import axios from '../core/network-service';

export async function fetchTransactions({address, page = 0, row = 50}) {
  const url = `${SUBSCAN_URL}/api/scan/transfers`;

  const {data} = await axios.post(
    url,
    JSON.stringify({
      row,
      page,
      address: address,
    }),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
  return {
    ...data,
    hasNextPage: (page + 1) * row < data.count,
  };
}
