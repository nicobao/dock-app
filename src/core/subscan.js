const SUBSCAN_URL = 'https://dock.api.subscan.io';
const mockData = {
  code: 0,
  message: 'Success',
  generated_at: 1636462778,
  data: {
    count: 709,
    transfers: [
      {
        from: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
        to: '3Db17VnGhBf9KW3s7gd7PPQN6wteQLzgbx1PwTcXZwYLNaBa',
        extrinsic_index: '3493559-1',
        success: true,
        hash: '0xfa3e76163383d6a12796b090838b0480bf9bd8faa3fa623ca8e48eaa53ab5a56',
        block_num: 3493559,
        block_timestamp: 1636332132,
        module: 'balances',
        amount: '44990',
        fee: '2085000',
        nonce: 1427,
        asset_symbol: '',
        from_account_display: {
          address: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
        to_account_display: {
          address: '3Db17VnGhBf9KW3s7gd7PPQN6wteQLzgbx1PwTcXZwYLNaBa',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
      },
      {
        from: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
        to: '3CRG84Q9MqPCGt5R89Fhk412M5Rx4w6GMWVm1HxwRx6ba4ew',
        extrinsic_index: '3492979-1',
        success: true,
        hash: '0xa503fe5a41cc1b1568a82cd7b654f01505ce3b5c53d977eb55114edcbb86ceb6',
        block_num: 3492979,
        block_timestamp: 1636330392,
        module: 'balances',
        amount: '24778',
        fee: '2085000',
        nonce: 1426,
        asset_symbol: '',
        from_account_display: {
          address: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
        to_account_display: {
          address: '3CRG84Q9MqPCGt5R89Fhk412M5Rx4w6GMWVm1HxwRx6ba4ew',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
      },
      {
        from: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
        to: '3CRG84Q9MqPCGt5R89Fhk412M5Rx4w6GMWVm1HxwRx6ba4ew',
        extrinsic_index: '3483265-1',
        success: true,
        hash: '0x1c5ff609edbe01b41647270242aca9cebb7c07d3c3f8886632973bbb15401dcf',
        block_num: 3483265,
        block_timestamp: 1636301235,
        module: 'balances',
        amount: '38534',
        fee: '2085000',
        nonce: 1425,
        asset_symbol: '',
        from_account_display: {
          address: '3Cd1Y8uxyy19NGTwDWu1hZjuFkVPfRvG8brFLWQ5SdFCtaPJ',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
        to_account_display: {
          address: '3CRG84Q9MqPCGt5R89Fhk412M5Rx4w6GMWVm1HxwRx6ba4ew',
          display: '',
          judgements: null,
          account_index: '',
          identity: false,
          parent: null,
        },
      },
    ],
  },
};

export function fetchTransactions({address, page = 1, row = 50}) {
  const url = `${SUBSCAN_URL}/api/scan/transfers`;

  return fetch(url, {
    method: 'POST',
    headers: {
      // 'X-API-Key': 'c04363fd7b8e6f14aa01d4dd15ce6ffb',
      'content-type': 'application/json',
    },
    body: {
      row: row,
      page: page,
      address: address,
    },
  })
    .then(res => res.json())
    .catch(err => {
      console.log(err);
      return mockData;
    });
}
