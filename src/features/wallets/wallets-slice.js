import {createSlice} from '@reduxjs/toolkit';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import Keyring from '@polkadot/keyring';
import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';

const initialState = {
  loading: true,
  items: undefined,
  keyring: undefined,
  currentWallet: undefined,
};

const wallets = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.listLoading = action.payload;
    },
    setItems(state, action) {
      state.list = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      const symbol = action.payload;
      state.items = state.items.filter(item => item.symbol !== symbol);
    },
    setKeyring(state, action) {
      state.keyring = action.payload;
    },
    setCurrentWallet(state, action) {
      state.currentWallet = action.payload;
    },
  },
});

export const walletsActions = wallets.actions;

const getRoot = state => state.wallets;

export const walletsSelectors = {
  getLoading: state => getRoot(state).loading,
  getItems: state => getRoot(state).items,
  getKeyring: (state: any): Keyring => getRoot(state).keyring,
  getCurrentWallet: (state: any) => getRoot(state).currentWallet,
};

export const walletsOperations = {
  initialize: () => async (dispatch, getState) => {
    cryptoWaitReady().then(() => {
      const keyring = new Keyring();
      dispatch(walletsActions.setKeyring(keyring));
    });
  },
  createWallet: ({password, walletName}) => async (dispatch, getState) => {
    const state = getState();
    const mnemonic = mnemonicGenerate(12);
    const keyring = walletsSelectors.getKeyring(state);
    const pair = keyring.addFromMnemonic(mnemonic, {
      name: walletName,
    });
    const encodedPair = pair.toJson(password);

    dispatch(walletsActions.addItem(encodedPair));
    dispatch(walletsActions.setCurrentWallet(pair));

    navigate(Routes.CREATE_WALLET_MNEMONIC, {
      mnemonic,
    });
  },
  unlockWallet: ({password, address}) => async (dispatch, getState) => {
    const state = getState();
    const walletJson = walletsSelectors
      .getItems(state)
      .find(wallet => wallet.address === address);
    const keyring = walletsSelectors.getKeyring(state);
    const decodedPair = keyring.addFromJson(walletJson, true);

    decodedPair.unlock(password);

    dispatch(walletsActions.setCurrentWallet(decodedPair));

    navigate(Routes.APP_HOME);
  },
};

export const walletsReducer = wallets.reducer;
