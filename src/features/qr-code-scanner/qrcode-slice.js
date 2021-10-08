import {createSlice} from '@reduxjs/toolkit';

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
    console.log('QR Code data received', data);
  },
};

export const qrCodeReducer = qrCode.reducer;
