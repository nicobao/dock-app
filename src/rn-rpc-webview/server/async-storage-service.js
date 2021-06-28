import AsyncStorage from '@react-native-community/async-storage';

export default {
  name: "storage",
  routes: [
    async function getItem(...params) {
      const result = await AsyncStorage.getItem(...params);
      
      console.log('Getting storage item', {
        params,
        result,
      });

      return result;
    },
    async function setItem(...params) {
      console.log('Set storage item', {
        params,
      });

      const result = AsyncStorage.setItem(...params);

      AsyncStorage.getItem(params[0]).then(value => console.log('Storage udpated', JSON.parse(value)));
      
      return result;
    },
  ],
};
