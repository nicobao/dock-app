import {combineReducers} from '@reduxjs/toolkit';
import {walletsReducer} from '../features/wallets/wallets-slice';

export const rootReducer = combineReducers({
  wallets: walletsReducer,
});
