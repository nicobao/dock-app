import {createSlice} from '@reduxjs/toolkit';
import { DockRpc } from '../../rn-rpc-webview/dock-rpc';

import schemaMock from './schema-mock.json';
import manifestMock from './manifest-mock.json';

const initialState = {
  loading: true,
  schema: null,
  manifest: null,
};

const credIssuance = createSlice({
  name: 'credIssuance',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setManifest(state, action) {
      state.manifest = action.payload;
    },
    setSchema(state, action) {
      state.schema = action.payload;
    },
  },
});

export const credIssuanceActions = credIssuance.actions;

const getRoot = state => state.credIssuance;

export const credIssuanceSelectors = {
  getLoading: state => getRoot(state).loading,
  getManifest: state => getRoot(state).manifest,
  getSchema: state => getRoot(state).schema,
};

export const credIssuanceOperations = {
  /**
   * Fetch CREDENTIALs for the current wallet
   *
   * @returns
   */
  fetch: () => async (dispatch, getState) => {
    dispatch(credIssuanceActions.setLoading(true));
    dispatch(credIssuanceActions.setManifest(manifestMock));
    dispatch(credIssuanceActions.setSchema(schemaMock));
    dispatch(credIssuanceActions.setLoading(false));
  },
};

export const credIssuanceReducer = credIssuance.reducer;
