import {combineReducers} from '@reduxjs/toolkit';
import {didReducer} from '../features/did/did-slice';
import {walletsReducer} from '../features/wallets/wallets-slice';

export const rootReducer = combineReducers({
  wallets: walletsReducer,
  did: didReducer,
});
