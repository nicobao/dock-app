import {createSlice} from '@reduxjs/toolkit';
import {Keychain} from '../../core/keychain';
import {navigate} from '../../core/navigation';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {Routes} from '../../core/routes';
import {appSelectors, BiometryType} from '../app/app-slice';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
  loading: true,
  passcode: null,
};

const wallet = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setPasscode(state, action) {
      state.passcode = action.payload;
    },
    setWalletInfo(state, action) {
      state.walletInfo = action.payload;
    },
  },
});

export const walletActions = wallet.actions;

const getRoot = state => state.wallet;

export const walletSelectors = {
  getLoading: state => getRoot(state).loading,
  getPasscode: state => getRoot(state).passcode,
  getWalletInfo: state => getRoot(state).walletInfo,
};

export const walletOperations = {
  unlockWallet:
    ({biometry, passcode } = {}) =>
    async (dispatch, getState) => {
      const keychainId = 'wallet';
      
      if (biometry) {
        await Keychain.getItem(`${keychainId}-biometric`, {
          authenticationPrompt: {
            title: 'Allow dock wallet to use your biometry',
          },
        });
      } else {
        const keychainData = await Keychain.getItem(keychainId);
        
        if (keychainData.passcode !== passcode) {
          throw new Error({
            code: 401,
            message: 'Passcode doesn\'t match, please try again'
          });
        }
      }
      
      // TODO: Load accounts in the wallet

      navigate(Routes.ACCOUNTS);
    },

  createWallet:
    ({biometry = false} = {}) =>
    async (dispatch, getState) => {
      const passcode = walletSelectors.getPasscode(getState());
      const keychainId = 'wallet';
      const keychainProps = {
        passcode: passcode.toString(),
      };

      if (biometry) {
        const biometryType = appSelectors.getSupportedBiometryType(getState());

        if (biometryType === BiometryType.Fingerprint) {
          await Keychain.setItem(`${keychainId}-biometric`, keychainProps, {
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
            authenticationType: Keychain.BIOMETRY_TYPE.FINGERPRINT,
            storage: Keychain.STORAGE_TYPE.RSA,
          });
        } else {
          await Keychain.setItem(`${keychainId}-biometric`, keychainProps, {
            accessControl:
              Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
          });
        }

        await Keychain.getItem(`${keychainId}-biometric`, {
          authenticationPrompt: {
            title: 'Allow dock wallet to use your biometry',
          },
        });
      }

      await Keychain.setItem(keychainId, keychainProps, {});
      const walletInfo = {
        biometry,
      };
      await AsyncStorage.setItem('walletInfo', JSON.stringify(walletInfo));

      const keychainData = await Keychain.getItem(keychainId);

      dispatch(walletActions.setWalletInfo(walletInfo));

      WalletRpc.create(keychainId);

      navigate(Routes.ACCOUNTS);
    },
};

const waitUntil = time => new Promise(res => setTimeout(res, time));

export const walletReducer = wallet.reducer;
