const SUBSCAN_URL = 'https://dock.api.subscan.io';

export function fetchTransactions({address, page = 1, row = 50}) {
  const url = `${SUBSCAN_URL}/api/scan/transfers`;

  return fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: {
      row: row,
      page: page,
      address: address,
    },
  }).then(res => res.json());
}
