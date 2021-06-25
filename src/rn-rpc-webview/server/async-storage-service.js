import AsyncStorage from '@react-native-community/async-storage';

export default {
  name: "storage",
  routes: [
    async function getItem(...params) {
      return AsyncStorage.getItem(...params);
    },
    async function setItem(...params) {
      return AsyncStorage.setItem(...params);
    },
  ],
};
