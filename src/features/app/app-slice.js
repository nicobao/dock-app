import {KeyringRpc} from '@docknetwork/react-native-sdk/src/client/keyring-rpc';
import {DockRpc} from '@docknetwork/react-native-sdk/src/client/dock-rpc';
import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import AsyncStorage from '@react-native-community/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import SplashScreen from 'react-native-splash-screen';
import {Keychain} from '../../core/keychain';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletActions} from '../wallet/wallet-slice';
import {initRealm} from 'src/core/realm';
import {SUBSTRATE_URL} from '@env';

export const BiometryType = {
  FaceId: Keychain.BIOMETRY_TYPE.FACE_ID,
  Fingerprint: Keychain.BIOMETRY_TYPE.FINGERPRINT,
};

const initialState = {
  loading: true,
  supportedBiometryType: null,
  rpcReady: false,
  dockReady: false,
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setRpcReady(state, action) {
      state.rpcReady = action.payload;
    },
    setDockReady(state, action) {
      state.dockReady = action.payload;
    },
    setSupportedBiometryType(state, action) {
      state.supportedBiometryType = action.payload;
    },
  },
});

export const appActions = app.actions;

const getRoot = state => state.app;

export const appSelectors = {
  getLoading: state => getRoot(state).loading,
  getSupportedBiometryType: state => getRoot(state).supportedBiometryType,
  getRpcReady: state => getRoot(state).rpcReady,
  getDockReady: state => getRoot(state).dockReady,
};

export const appOperations = {
  waitRpcReady: () => async (dispatch, getState) => {
    return new Promise(res => {
      const checkRpc = () => {
        if (appSelectors.getRpcReady(getState())) {
          return res();
        }

        setTimeout(checkRpc, 500);
      };

      checkRpc();
    });
  },
  waitDockReady: () => async (dispatch, getState) => {
    return new Promise(res => {
      const checkDock = () => {
        if (appSelectors.getDockReady(getState())) {
          return res();
        }

        setTimeout(checkDock, 500);
      };

      checkDock();
    });
  },
  rpcReady: () => async (dispatch, getState) => {
    console.log('Rpc ready');
    await UtilCryptoRpc.cryptoWaitReady();
    await KeyringRpc.initialize();
    await WalletRpc.create('wallet');
    await WalletRpc.load();
    await WalletRpc.sync();

    dispatch(appActions.setRpcReady(true));

    try {
      await DockRpc.init({
        address: SUBSTRATE_URL,
      });

      dispatch(appActions.setDockReady(true));

      console.log('Dock initialized');
    } catch (err) {
      console.error('Unable to initialize dock', err);
    }
  },
  initialize: () => async (dispatch, getState) => {
    await initRealm();

    console.log('Realm initialized');
    SplashScreen.hide();

    await Keychain.getSupportedBiometryType().then(value => {
      let type;

      if (value === Keychain.BIOMETRY_TYPE.FACE_ID) {
        type = BiometryType.FaceId;
      } else if (
        value === Keychain.BIOMETRY_TYPE.TOUCH_ID ||
        value === Keychain.BIOMETRY_TYPE.FINGERPRINT
      ) {
        type = BiometryType.Fingerprint;
      }

      dispatch(appActions.setSupportedBiometryType(type));
    });

    const walletInfo = await AsyncStorage.getItem('walletInfo');
    let walletCreated;

    if (walletInfo) {
      try {
        dispatch(walletActions.setWalletInfo(JSON.parse(walletInfo)));
        walletCreated = true;
      } catch (err) {
        console.error(err);
      }
    }

    if (walletCreated) {
      navigate(Routes.UNLOCK_WALLET);
    } else {
      navigate(Routes.CREATE_WALLET);
    }
  },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const appReducer = app.reducer;
