import {createSlice} from '@reduxjs/toolkit';

import {
  createNewDockDID,
  createKeyDetail,
  createSignedDidRemoval,
  createSignedKeyUpdate,
} from '@docknetwork/sdk/utils/did';

import {
  getPublicKeyFromKeyringPair
} from '@docknetwork/sdk/utils/misc';


import dock, {PublicKeySr25519} from '@docknetwork/sdk';

import {walletsOperations, walletsSelectors} from '../wallets/wallets-slice';

const initialState = {
  loading: true,
  items: undefined,
};

const did = createSlice({
  name: 'did',
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
      const didDoc = action.payload;
      state.items = state.items.filter(item => item.id !== didDoc.id);
    },
  },
});

export const didActions = did.actions;

const getRoot = state => state.did;

export const didSelectors = {
  getLoading: state => getRoot(state).loading,
  getItems: state => getRoot(state).items,
};

export const didOperations = {
  /**
   * Fetch DIDs for the current wallet
   *
   * @returns
   */
  fetch: () => async (dispatch, getState) => {
    dispatch(didActions.setLoading(false));
  },

  updateDID: ({ newController, didDoc }) => async (dispatch, getState) => {
    const currentPair = walletsSelectors.getCurrentWallet(getState());
    const publicKey = getPublicKeyFromKeyringPair(currentPair);
    const [keyUpdate, signature] = await createSignedKeyUpdate(dock.did, didDoc.id, publicKey, currentPair, newController);
    await dock.did.updateKey(keyUpdate, signature, false);
  },
  removeDID: didDoc => async (dispatch, getState) => {
    dispatch(didActions.setLoading(true));
    dispatch(didActions.removeItem(didDoc));

    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);

    try {
      const [didRemoval, signature] = await createSignedDidRemoval(
        dock.did,
        didDoc.id,
        wallet,
      );

      await dock.did.remove(didRemoval, signature, false);

      dispatch(walletsOperations.fetchBalance());      
    } catch (err) {
      console.error(err);
      // TODO: Handle did errors
      dispatch(didActions.setLoading(false));
    }
  },
  createDID: () => async (dispatch, getState) => {
    dispatch(didActions.setLoading(true));

    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    const dockDID = createNewDockDID();
    const publicKey = PublicKeySr25519.fromKeyringPair(wallet);

    // The controller is same as the DID
    const keyDetail = createKeyDetail(publicKey, dockDID);

    await dock.did.new(dockDID, keyDetail, false);

    const didDocument = await dock.did.getDocument(dockDID);

    dispatch(walletsOperations.fetchBalance());
    dispatch(didActions.addItem({
      ...didDocument,
      walletId: wallet.address,
    }));
    dispatch(didActions.setLoading(false));
  },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const didReducer = did.reducer;
