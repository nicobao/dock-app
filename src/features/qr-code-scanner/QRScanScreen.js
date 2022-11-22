import Clipboard from '@react-native-community/clipboard';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {BackButton, Button, Theme} from 'src/design-system';
import styled from 'styled-components/native';
import {Colors} from '../../theme/colors';
import {qrCodeHandler} from './qr-code';
import {translate} from '../../locales';
import {useIsFocused} from '@react-navigation/native';
import {Box, Spinner} from 'native-base';
import QRCode from 'react-native-qrcode-svg';

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.black};
`;

const Header = styled.View`
  height: 80px;
  width: 100%;
  padding-top: 10px;
`;

const Title = styled.Text`
  color: ${Colors.white};
  font-size: 18px;
  line-height: 24px;
  padding-top: 8px;
  width: 100%;
  text-align: center;
`;

const Footer = styled.View`
  display: flex;
  justify-content: center;
  background: ${Theme.colors.primaryBackground};
  border-radius: 4px;
  margin: 20px;
  height: 93px;
`;

const Description = styled.Text`
  color: ${Colors.white};
  font-size: 18px;
  text-align: center;
`;

const SmallDescription = styled.Text`
  color: ${Colors.white};
  font-size: 13px;
  text-align: center;
`;

const Body = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.SafeAreaView`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const QRCodeContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ScreenState = {
  scanning: 'scanning',
  dataLoaded: 'dataLoaded',
  paused: 'loading',
};

export function QRScanScreen({onData, isScreenFocus}) {
  const [state, setState] = useState(ScreenState.scanning);
  const [qrData, setQRData] = useState();
  const windowWidth = Dimensions.get('window').width;

  const handleData = data => {
    setQRData(data);
    setState(ScreenState.loading);
    Promise.resolve(onData(data)).finally(() => {
      setState(ScreenState.dataLoaded);
    });
  };

  const renderFooter = () => {
    if (state === ScreenState.scanning) {
      return (
        <TouchableWithoutFeedback
          onPress={async () => {
            const text = await Clipboard.getString();
            handleData(text);
          }}>
          <Footer>
            <Description>{translate('qr_scanner.scanning_footer')}</Description>
            <SmallDescription>
              {translate('qr_scanner.scanning_instructions')}
            </SmallDescription>
          </Footer>
        </TouchableWithoutFeedback>
      );
    }

    if (state === ScreenState.dataLoaded) {
      return (
        <Box mb={6} mx={8}>
          <Button onPress={() => setState(ScreenState.scanning)}>
            {translate('qr_scanner.scan_new')}
          </Button>
        </Box>
      );
    }

    return (
      <Box mb={6}>
        <Spinner color={Colors.white} />
      </Box>
    );
  };

  useEffect(() => {
    setState(ScreenState.scanning);
  }, []);

  return (
    <Container>
      <QRCodeContainer>
        {Boolean(isScreenFocus) && state === ScreenState.scanning && (
          <QRCodeScanner
            style={styles.scanner}
            reactivate={true}
            reactivateTimeout={10000}
            flashMode={RNCamera.Constants.FlashMode.off}
            cameraStyle={{height: Dimensions.get('window').height}}
            topViewStyle={styles.scannerTopView}
            bottomViewStyle={styles.scannerBottomView}
            onRead={event => handleData(event.data)}
          />
        )}
      </QRCodeContainer>
      <Wrapper>
        <Header>
          <Title style={styles.headerText}>
            {translate('qr_scanner.title')}
          </Title>
        </Header>
        <Body>
          {state === ScreenState.scanning ? (
            <View style={{width: 240, height: 230}}>
              <View style={[styles.frame, styles.frameLeftTop]} />
              <View style={[styles.frame, styles.frameRightTop]} />
              <View style={[styles.frame, styles.frameLeftBottom]} />
              <View style={[styles.frame, styles.frameRightBottom]} />
            </View>
          ) : (
            Boolean(qrData) && (
              <QRCode value={qrData} size={windowWidth * 0.8} />
            )
          )}
        </Body>
        {renderFooter()}
      </Wrapper>
    </Container>
  );
}
export function QRScanContainer({route, navigation}) {
  const {onData = qrCodeHandler} = route.params || {};
  const isScreenFocus = useIsFocused();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);
  return <QRScanScreen onData={onData} isScreenFocus={isScreenFocus} />;
}
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  scanner: {
    flex: 1,
  },
  scannerTopView: {
    height: 0,
    flex: 0,
  },
  scannerBottomView: {
    height: 0,
    flex: 0,
  },
  frame: {
    width: 60,
    height: 60,
    borderStyle: 'solid',
    borderColor: Colors.blue,
    position: 'absolute',
  },
  frameLeftTop: {
    left: 0,
    top: 0,
    borderLeftWidth: 12,
    borderTopWidth: 12,
  },
  frameRightTop: {
    right: 0,
    top: 0,
    borderRightWidth: 12,
    borderTopWidth: 12,
  },
  frameLeftBottom: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 12,
    borderBottomWidth: 12,
  },
  frameRightBottom: {
    right: 0,
    bottom: 0,
    borderRightWidth: 12,
    borderBottomWidth: 12,
  },
  headerIcon: {
    padding: 20,
  },
  headerText: {
    color: Theme.colors.textHighlighted,
    fontFamily: Theme.fontFamily.default,
  },
});
