import {createSlice} from '@reduxjs/toolkit';
import {Keychain} from '../../core/keychain';
import {navigate} from '../../core/navigation';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import DocumentPicker from 'react-native-document-picker';
import {Routes} from '../../core/routes';
import {appSelectors, BiometryType} from '../app/app-slice';
import AsyncStorage from '@react-native-community/async-storage';
import {accountOperations} from '../accounts/account-slice';
import RNFS from 'react-native-fs';
import Share from 'react-native-share'
import { showToast } from '../../core/toast';

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
  pickWalletBackup: () => async (dispatch, getState) => {
    const file = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });

    navigate(Routes.WALLET_IMPORT_BACKUP_PASSWORD, {
      fileUri: file.fileCopyUri,
    });
  },
  importWallet: ({ fileUri, password }) => async (dispatch, getState) => {
    const fileData = await RNFS.readFile(fileUri);
    const jsonData = JSON.parse(fileData);
    try {
      await AsyncStorage.removeItem('wallet');
      await WalletRpc.importWallet(jsonData, password);
      navigate(Routes.CREATE_WALLET_PASSCODE);
    } catch(err) {
      console.error(err);
      showToast({
        message: 'Invalid password',
        type: 'error'
      })
    }
  },
  exportWallet: ({ password }) => async (dispatch, getState) => {
    const walletBackup = await WalletRpc.export(password);
    const jsonData = JSON.stringify(walletBackup);
    const path = `${RNFS.DocumentDirectoryPath}/walletBackup.json`;
    const mimeType = 'application/json';
    await RNFS.writeFile(path, jsonData);

    try {
      await Share.open({
        url: "file://" + path,
        type: mimeType,
      })
    } catch(err) {
      console.error(err);
      showToast({
        message: 'Unable to generate backup',
        type: 'error',
      }) 
    }
    
    RNFS.unlink(path);
    
  },
  deleteWallet: () => async (dispatch, getState) => {
    await AsyncStorage.removeItem('walletInfo');
    await AsyncStorage.removeItem('wallet');
    dispatch(walletActions.setWalletInfo(null));
    navigate(Routes.CREATE_WALLET);
  },
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

      dispatch(accountOperations.loadAccounts())

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
