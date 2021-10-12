import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  name: 'storage',
  routes: {
    async getItem(...params) {
      return AsyncStorage.getItem(...params);
    },
    async setItem(...params) {
      console.log('Set storage item', {
        params,
      });

      return AsyncStorage.setItem(...params);
    },
  },
};
