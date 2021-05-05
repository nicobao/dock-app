import {createSlice} from '@reduxjs/toolkit';

import dock from '@docknetwork/sdk';
import {DockResolver} from '@docknetwork/sdk/resolver';

import {
  KeyringPairDidKeys,
  OneOfPolicy,
  getDockRevIdFromCredential,
  DockRevRegQualifier,
  RevRegType,
} from '@docknetwork/sdk/utils/revocation';

import {walletsSelectors} from '../wallets/wallets-slice';
import getKeyDoc from '@docknetwork/sdk/utils/vc/helpers';
import {
  issueCredential,
  verifyCredential,
  expandJSONLD,
} from '@docknetwork/sdk/utils/vc/index';
import {randomAsHex} from '@polkadot/util-crypto';

import {didSelectors} from '../did/did-slice';

function addRevRegIdToCred(cred, regId) {
  return {
    ...cred,
    credentialStatus: {
      id: `${DockRevRegQualifier}${regId}`,
      type: RevRegType,
    },
  };
}

const initialState = {
  loading: true,
  items: [],
  registry: null,
};

const credential = createSlice({
  name: 'credential',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setItems(state, action) {
      state.items = action.payload;
    },
    setRegistry(state, action) {
      state.registry = action.payload;
    },
    addItem(state, action) {
      if (!state.items) {
        state.items = [];
      }

      state.items.push(action.payload);
    },
    removeItem(state, action) {
      const credentialDoc = action.payload;
      state.items = state.items.filter(item => item.id !== credentialDoc.id);
    },
  },
});

export const credentialActions = credential.actions;

const getRoot = state => state.credential;

export const credentialSelectors = {
  getLoading: state => getRoot(state).loading,
  getItems: state => getRoot(state).items,
  getRegistry: state => getRoot(state).registry,
};

const resolver = new DockResolver(dock);

// hardcoded registry for testing
const registryId =
  '0x99bfe2629e7e62928b799a54ccfded19c9b88ed98f032569fffcef6ca82241b5';

export const credentialOperations = {
  /**
   * Fetch CREDENTIALs for the current wallet
   *
   * @returns
   */
  fetch: () => async (dispatch, getState) => {
    dispatch(credentialActions.setLoading(false));
    await dispatch(credentialOperations.loadRegistry());
  },

  loadRegistry: () => async (dispatch, getState) => {
    const state = getState();
    let registry = credentialSelectors.getRegistry(state);

    if (!registry) {
      const issuerDID = didSelectors.getItems(state)[0].id;
      const policy = new OneOfPolicy();
      policy.addOwner(issuerDID);

      registry = await dock.revocation.newRegistry(
        registryId,
        policy,
        false,
        false,
      );

      dispatch(credentialActions.setRegistry(registry));
    }
  },

  revokeCredential: credentialDoc => async (dispatch, getState) => {
    const state = getState();
    credentialDoc = {
      ...credentialDoc,
    };

    delete credentialDoc.walletId;

    const expanded = await expandJSONLD(credentialDoc);
    const revId = getDockRevIdFromCredential(expanded);

    const didKeys = new KeyringPairDidKeys();
    const pair = walletsSelectors.getCurrentWallet(state);
    const issuerDID = didSelectors.getItems(state)[0].id;
    didKeys.set(issuerDID, pair);

    await dock.revocation.revokeCredential(didKeys, registryId, revId, false);

    debugger;
  },
  verifyCredential: credentialDoc => async (dispatch, getState) => {
    credentialDoc = {
      ...credentialDoc,
    };

    delete credentialDoc.walletId;

    const result = await verifyCredential(credentialDoc, {resolver});

    console.log(result);

    alert(`Verified: ${result.verified}`);
  },
  createCredential: () => async (dispatch, getState) => {
    dispatch(credentialActions.setLoading(true));
    const state = getState();
    const wallet = walletsSelectors.getCurrentWallet(state);
    const did = didSelectors.getItems(state)[0].id;
    const issuerKey = getKeyDoc(did, wallet, 'Ed25519VerificationKey2018');

    // Use the same did for testing
    const credId = randomAsHex(32);
    const holderDID = did;

    let unsignedCred = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
      ],
      id: credId,
      type: ['VerifiableCredential', 'AlumniCredential'],
      issuanceDate: '2020-03-18T19:23:24Z',
      credentialSubject: {
        id: holderDID,
        alumniOf: 'Example University',
      },
    };

    unsignedCred = addRevRegIdToCred(unsignedCred, registryId);

    const credentialDocument = await issueCredential(issuerKey, unsignedCred);

    dispatch(
      credentialActions.addItem({
        ...credentialDocument,
        walletId: wallet.address,
      }),
    );
    dispatch(credentialActions.setLoading(false));
  },
};

export const credentialReducer = credential.reducer;
