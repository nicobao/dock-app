import {KeyringRpc} from '@docknetwork/react-native-sdk/src/client/keyring-rpc';
import {DockRpc} from '@docknetwork/react-native-sdk/src/client/dock-rpc';
import {UtilCryptoRpc} from '@docknetwork/react-native-sdk/src/client/util-crypto-rpc';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import SplashScreen from 'react-native-splash-screen';
import {Keychain} from '../../core/keychain';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletActions} from '../wallet/wallet-slice';
import {initRealm} from 'src/core/realm';
import {NETWORK} from '@env';
import {translate} from 'src/locales';
import {Logger} from 'src/core/logger';

export const BiometryType = {
  FaceId: Keychain.BIOMETRY_TYPE.FACE_ID,
  Fingerprint: Keychain.BIOMETRY_TYPE.FINGERPRINT,
};

export const SUBSTRATE_NETWORKS = {
  mainnet: {
    name: 'Dock PoS Mainnet',
    url: 'wss://mainnet-node.dock.io',
    addressPrefix: 22,
  },
  testnet: {
    name: 'Dock PoS Testnet',
    url: 'wss://knox-1.dock.io',
    addressPrefix: 21,
  },
  local: {
    name: 'Local Node',
    url: 'ws://127.0.0.1:9944',
    addressPrefix: 21,
  },
};

function getNetworkInfo(networkId) {
  const networkInfo = SUBSTRATE_NETWORKS[networkId];

  if (!networkInfo) {
    throw new Error(`Network ${networkId} not found`);
  }

  return networkInfo;
}

function initKeyring(networkId) {
  Logger.debug('init keyring for network', networkId);
  const addressPrefix = getNetworkInfo(networkId).addressPrefix;

  return KeyringRpc.initialize({
    ss58Format: addressPrefix,
  });
}

const initialState = {
  loading: true,
  supportedBiometryType: null,
  rpcReady: false,
  dockReady: false,
  networkId: NETWORK,
  devSettingsEnabled: false,
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
    setNetworkId(state, action) {
      state.networkId = action.payload;
    },
    setDevSettingsEnabled(state, action) {
      state.devSettingsEnabled = action.payload;
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
  getNetworkId: state => getRoot(state).networkId,
  getDevSettingsEnabled: state => getRoot(state).devSettingsEnabled,
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
    Logger.debug('Rpc ready');
    const networkId = appSelectors.getNetworkId(getState());
    const networkInfo = getNetworkInfo(networkId);

    try {
      await UtilCryptoRpc.cryptoWaitReady();
      await initKeyring(networkId);
      await WalletRpc.create('wallet');
      await WalletRpc.load();
      await WalletRpc.sync();
      dispatch(appActions.setRpcReady(true));
    } catch (err) {
      dispatch(
        appActions.setRpcReady(
          new Error(translate('global.webview_connection_error')),
        ),
      );
      console.error(err);
    }

    try {
      await DockRpc.init({
        address: networkInfo.url,
      });

      dispatch(appActions.setDockReady(true));

      Logger.debug('Dock initialized');
    } catch (err) {
      dispatch(
        appActions.setDockReady(new Error('Unable to initialize dock api')),
      );
      console.error(err);
    }
  },
  initialize: () => async (dispatch, getState) => {
    await initRealm();

    Logger.debug('Realm initialized');
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

  setNetwork: networkId => async (dispatch, getState) => {
    dispatch(appActions.setNetworkId(networkId));

    await initKeyring(networkId);
    const substrateUrl = getNetworkInfo(networkId).url;

    Logger.debug('Init dock with url', substrateUrl);

    DockRpc.init({
      address: substrateUrl,
    });
  },
};

export const appReducer = app.reducer;
