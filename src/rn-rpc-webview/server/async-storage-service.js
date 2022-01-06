import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logger} from 'src/core/logger';

export default {
  name: 'storage',
  routes: {
    async getItem(...params) {
      return AsyncStorage.getItem(...params);
    },
    async setItem(...params) {
      Logger.debug('Set storage item', {
        params,
      });

      return AsyncStorage.setItem(...params);
    },
  },
};
