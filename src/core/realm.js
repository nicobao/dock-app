import Realm from 'realm';
import {Account, TokenPrice, Transaction} from './realm-schemas';

let realm;

export async function initRealm() {
  try {
    realm = await Realm.open({
      path: 'dock',
      schema: [TokenPrice, Transaction, Account],
      schemaVersion: 3,
      deleteRealmIfMigrationNeeded: false,
      migration: () => {
        // No migration required so far
      },
    });
  } catch(err) {
    console.log(err);
  }
}

export function getRealm(): Realm {
  return realm;
}
