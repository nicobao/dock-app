import {createSlice} from '@reduxjs/toolkit';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import Keyring from '@polkadot/keyring';
import {cryptoWaitReady, mnemonicGenerate} from '@polkadot/util-crypto';
import dock from '@docknetwork/sdk';
import Clipboard from '@react-native-community/clipboard';

const initialState = {
  loading: true,
  items: undefined,
  keyring: undefined,
  currentWallet: undefined,
  balance: 0,
};

const wallets = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    addItem(state, action) {
      state.items.push(action.payload);
    },
    removeItem(state, action) {
      const wallet = action.payload;
      state.items = state.items.filter(item => item.address !== wallet.address);
    },
    setKeyring(state, action) {
      state.keyring = action.payload;
    },
    setCurrentWallet(state, action) {
      state.currentWallet = action.payload;
    },
    setBalance(state, action) {
      state.balance = action.payload;
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
  getBalance: (state: any) => getRoot(state).balance,
};

export async function initDockSdk() {
  try {
    // TODO: Implement network switch
    await dock.init({
      address: 'ws://localhost:9944',
    });
  } catch (err) {
    console.error(err);
  }
}

export async function getKeyring() {
  return cryptoWaitReady().then(async () => {
    return new Keyring();
  });
}

export const walletsOperations = {
  exportJSON: () => async (dispatch, getState) => {
    const state = getState();
    const address = walletsSelectors.getCurrentWallet(state).address;
    const walletJson = walletsSelectors
      .getItems(state)
      .find(wallet => wallet.address === address);
      
    Clipboard.setString(JSON.stringify(walletJson));
  },
  deleteWallet: () => async (dispatch, getState) => {
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    await dispatch(walletsActions.removeItem(wallet));
    navigate(Routes.UNLOCK_WALLET);
  },
  fetchBalance: () => async (dispatch, getState) => {
    dispatch(walletsActions.setLoading(true));
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    const { data: { free: currentFree }} = await dock.api.query.system.account(wallet.address);

    dispatch(walletsActions.setBalance(currentFree.toHuman()));
    dispatch(walletsActions.setLoading(false));
    
  },
  initialize: () => async (dispatch, getState) => {
    const keyring = await getKeyring();
    await initDockSdk();

    // await dispatch(walletsOperations.initialize());
    // await dispatch(walletsOperations.unlockTestWallet());
    // const state = getState();
    // const wallet = walletsSelectors.getCurrentWallet(state);
    // dock.setAccount(wallet);
    dispatch(walletsActions.setKeyring(keyring));
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

    dispatch(walletsOperations.fetchBalance());

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

    dock.setAccount(decodedPair);

    dispatch(walletsActions.setCurrentWallet(decodedPair));
    await dispatch(walletsOperations.fetchBalance());

    navigate(Routes.APP_HOME);
  },
  /**
   * Operation used just for testing
   *
   * @returns
   */
  unlockTestWallet: () => async (dispatch, getState) => {
    const state = getState();
    const walletJson = walletsSelectors.getItems(state)[0];
    const keyring = walletsSelectors.getKeyring(state);
    const decodedPair = keyring.addFromJson(walletJson, true);

    decodedPair.unlock('mnemdm25');

    dispatch(walletsActions.setCurrentWallet(decodedPair));
  },
};

export const walletsReducer = wallets.reducer;
