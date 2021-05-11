import {combineReducers} from '@reduxjs/toolkit';
import {credentialReducer} from '../features/credentials/credential-slice';
import {didReducer} from '../features/did/did-slice';
import {walletsReducer} from '../features/wallets/wallets-slice';
import {credIssuanceReducer} from '../features/credential-issuance/cred-issuance-slice';

export const rootReducer = combineReducers({
  wallets: walletsReducer,
  did: didReducer,
  credential: credentialReducer,
  credIssuance: credIssuanceReducer,
});
