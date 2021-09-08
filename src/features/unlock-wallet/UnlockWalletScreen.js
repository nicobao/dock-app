import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {NumericKeyboard} from 'src/components/NumericKeyboard';
import {showToast} from 'src/core/toast';
import styled from 'styled-components/native';
import SplashLogo from '../../assets/splash-logo.png';
import {
  Box,
  Content,
  Image,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {appSelectors} from '../app/app-slice';
import {BuildIdentifier} from '../app/BuildIdentifier';
// import {NumericKeyboard} from '../wallet/CreatePasscodeScreen';
import {walletOperations, walletSelectors} from '../wallet/wallet-slice';

const Circle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid white;
  margin: 0 7px;
  background-color: ${props => (props.filled ? '#fff' : 'transparent')};
`;

function PasscodeMask({digits = 6, filled = 0, ...props}) {
  const digitsArray = new Array(digits).fill(0);

  return (
    <Box {...props}>
      <Box justifyContent="center" row>
        {digitsArray.map((_, idx) => (
          <Circle filled={idx < filled} key={idx} />
        ))}
      </Box>
    </Box>
  );
}

const DIGITS = 6;

export function UnlockWalletScreen({
  onPasscodeChange,
  passcode,
  onLoginWithBiometric,
  text = translate('unlock_wallet.enter_passcode'),
  digits = DIGITS,
  filled = 0,
  biometry = false,
}) {
  return (
    <ScreenContainer testID="unlockWalletScreen">
      <Box justifyContent="center" row>
        <Image
          source={SplashLogo}
          style={{
            width: '57%',
          }}
          resizeMode="contain"
        />
      </Box>
      <Content marginLeft={26} marginRight={26}>
        <PasscodeMask marginTop={20} digits={digits} filled={filled} />
        <Box alignItems="center">
          <Typography variant="h2" marginTop={52}>
            {text}
          </Typography>
        </Box>
        <NumericKeyboard
          marginTop={50}
          onChange={onPasscodeChange}
          value={passcode}
        />
        {biometry ? (
          <Box
            alignItems="center"
            marginBottom={20}
            onPress={onLoginWithBiometric}>
            <Typography variant="description">
              {translate('unlock_wallet.biometrics_login')}
            </Typography>
          </Box>
        ) : null}
        <BuildIdentifier />
      </Content>
    </ScreenContainer>
  );
}

export function UnlockWalletContainer({route}) {
  const {callback} = route.params || {};
  const [passcode, setPasscode] = useState('');
  const supportBiometry = useSelector(appSelectors.getSupportedBiometryType);
  const walletInfo = useSelector(walletSelectors.getWalletInfo);
  const biometryEnabled = walletInfo && walletInfo.biometry;

  const dispatch = useDispatch();

  const handlePasscodeChange = async value => {
    if (value.length > DIGITS) {
      return;
    }

    setPasscode(value);

    if (value.length === DIGITS) {
      try {
        await dispatch(
          walletOperations.unlockWallet({passcode: value, callback}),
        );
      } catch (err) {
        showToast({
          message: translate('unlock_wallet.invalid_passcode'),
          type: 'error',
        });
      }

      setTimeout(() => {
        setPasscode('');
      }, 100);
    }
  };

  const handleBiometricUnlock = useCallback(async () => {
    try {
      await dispatch(walletOperations.unlockWallet({biometry: true, callback}));
    } catch (err) {
      setPasscode('');
    }
  }, [dispatch, callback]);

  useEffect(() => {
    if (supportBiometry && biometryEnabled) {
      handleBiometricUnlock();
    } else {
      setPasscode('');
    }
  }, [supportBiometry, biometryEnabled, handleBiometricUnlock]);

  return (
    <UnlockWalletScreen
      digits={DIGITS}
      filled={passcode.length}
      onPasscodeChange={handlePasscodeChange}
      onLoginWithBiometric={handleBiometricUnlock}
      biometry={supportBiometry}
      passcode={passcode}
    />
  );
}
