import Realm from 'realm';
import {Logger} from './logger';
import {Account, TokenPrice, Transaction} from './realm-schemas';
import {showToast} from './toast';

let realm;

export async function initRealm() {
  realm = await Realm.open({
    path: 'dock',
    schema: [TokenPrice, Transaction, Account],
    schemaVersion: 2,
    deleteRealmIfMigrationNeeded: false,
    migration: () => {
      // No migration required so far
    }
  });
}

export function getRealm(): Realm {
  return realm;
}
