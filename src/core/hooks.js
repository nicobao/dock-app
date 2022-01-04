import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export function useBackHandler(callback) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        console.log('stuff');

        return true;
      },
    );

    return () => backHandler.remove();
  }, []);
}
