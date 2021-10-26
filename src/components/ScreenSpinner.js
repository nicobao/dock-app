import {Spinner} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export function ScreenSpinner() {
  return (
    <View style={styles.container}>
      <Spinner color={Colors.darkBlue} />
    </View>
  );
}
