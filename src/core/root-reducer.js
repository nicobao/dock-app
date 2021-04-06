import { combineReducers } from '@reduxjs/toolkit'
import { walletsReducer } from '../features/wallets/walletsSlice';

export const rootReducer = combineReducers({
  wallets: walletsReducer,
});