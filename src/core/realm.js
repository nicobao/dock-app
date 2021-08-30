import Realm from 'realm';
import { Logger } from './logger';
import { showToast } from './toast';

const TokenPrice = {
  name: 'TokenPrice',
  properties: {
    symbol: 'string',
    name: 'string?',
    price: 'float',
  },
};

const Transaction = {
  name: 'Transaction',
  properties: {
    id: 'string',
    date: 'date',
    fromAddress: 'string',
    recipientAddress: 'string',
    amount: 'string',
    feeAmount: 'string',
    status: 'string',
    
  },
  primaryKey: 'id',
};

const Account = {
  name: 'Account',
  properties: {
    id: 'string',
    name: 'string',
    balance: 'string?',
  },
  primaryKey: 'id',
};

let realm;

export async function initRealm() {
  realm = await Realm.open({
    path: "dock",
    schema: [TokenPrice, Transaction, Account],
    schemaVersion: 1,
    deleteRealmIfMigrationNeeded: true,
  });
}

export function getRealm(): Realm {
  return realm;
}
