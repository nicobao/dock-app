import {createSlice} from '@reduxjs/toolkit';
import { Logger } from 'src/core/logger';

const initialState = {
  isLoading: true,
};

const qrCode = createSlice({
  name: 'qrCode',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const qrCodeActions = qrCode.actions;

const getRoot = state => state.qrCode;

export const qrCodeSelectors = {
  getLoading: state => getRoot(state).loading,
};

export const qrCodeOperations = {
  handleQRCode: data => async (dispatch, getState) => {
    Logger.debug('QR Code data received', data);
  },
};

export const qrCodeReducer = qrCode.reducer;
