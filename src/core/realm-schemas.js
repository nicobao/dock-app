export const TokenPrice = {
  name: 'TokenPrice',
  properties: {
    symbol: 'string',
    name: 'string?',
    price: 'float',
  },
  primaryKey: 'symbol',
};

export const Transaction = {
  name: 'Transaction',
  properties: {
    id: 'string',
    hash: 'string?',
    date: 'date',
    fromAddress: 'string',
    recipientAddress: 'string',
    amount: 'string',
    feeAmount: 'string',
    status: 'string',
  },
  primaryKey: 'id',
};

export const Account = {
  name: 'Account',
  properties: {
    id: 'string',
    name: 'string',
    balance: 'string?',
  },
  primaryKey: 'id',
};
