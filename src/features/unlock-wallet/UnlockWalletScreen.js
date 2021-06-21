import React, {useEffect, useState} from 'react';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  Image,
} from '../../design-system';
import styled from 'styled-components/native';
import {BackButton} from '../../design-system/buttons';
import SplashLogo from '../../assets/splash-logo.png';
import KeyboardDeleteIcon from '../../assets/icons/keyboard-delete.svg';
import {useDispatch, useSelector} from 'react-redux';
import {appSelectors} from '../app/app-slice';
import {walletOperations, walletSelectors} from '../create-wallet/wallet-slice';

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
          <Circle filled={idx < filled} />
        ))}
      </Box>
    </Box>
  );
}

function KeyboardButton({onPress, value}) {
  return (
    <Box
      flex
      alignItems="center"
      onPress={() => value !== null && onPress(value)}>
      <Typography
        color="white"
        fontFamily="Montserrat"
        fontWeight="600"
        fontSize={30}
        lineHeight={37}>
        {value}
      </Typography>
    </Box>
  );
}

function NumericKeyboard({onNumber, onDelete, ...props}) {
  return (
    <Box {...props} flex>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[1, 2, 3].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[4, 5, 6].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[7, 8, 9].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
      </Box>
      <Box
        justifyContent="center"
        flexDirection="row"
        row
        autoSize
        marginBottom={24}>
        {[null, 0].map(value => (
          <KeyboardButton key={value} onPress={onNumber} value={value} />
        ))}
        <Box flex alignItems="center" paddingTop={5} onPress={onDelete}>
          <KeyboardDeleteIcon />
        </Box>
      </Box>
    </Box>
  );
}

const DIGITS = 6;

export function UnlockWalletScreen({
  onNumber,
  onDelete,
  onLoginWithBiometric,
  text = 'Enter your passcode',
  digits = DIGITS,
  filled = 0,
  biometry = false,
}) {
  return (
    <ScreenContainer testID="unlock-wallet-screen">
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
          <Typography
            fontFamily="Montserrat"
            fontSize={20}
            lineHeight={32}
            fontWeight="600"
            color="#fff"
            marginTop={52}>
            {text}
          </Typography>
        </Box>
        <NumericKeyboard
          marginTop={50}
          onDelete={onDelete}
          onNumber={onNumber}
        />
        {biometry ? (
          <Box
            alignItems="center"
            marginBottom={20}
            onPress={onLoginWithBiometric}>
            <Typography
              fontFamily="Montserrat"
              fontSize={14}
              lineHeight={32}
              fontWeight="600"
              color="#fff">
              Login with biometric
            </Typography>
          </Box>
        ) : null}
      </Content>
    </ScreenContainer>
  );
}

export function UnlockWalletContainer() {
  const [passcode, setPasscode] = useState('');
  const supportBiometry = useSelector(appSelectors.getSupportedBiometryType);
  const walletInfo = useSelector(walletSelectors.getWalletInfo);
  const dispatch = useDispatch();

  const handleNumber = async (num) => {
    const value = `${passcode}${num}`;

    if (value.length > DIGITS) {
      return;
    }

    setPasscode(value);

    if (value.length === DIGITS) {
      try {
        await dispatch(walletOperations.unlockWallet({passcode: value}));
      } catch(err) {
        alert('Passcode doesn`t match');
        setTimeout(() => {
          setPasscode('');
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPasscode(passcode.substring(0, passcode.length - 1));
  };

  const handleBiometricUnlock = async () => {
    try {
      await dispatch(walletOperations.unlockWallet({biometry: true}));
    } catch(err) {
      setPasscode('');
    }
  };

  useEffect(() => {
    if (supportBiometry && walletInfo.biometry) {
      handleBiometricUnlock();
    }
  }, []);

  return (
    <UnlockWalletScreen
      digits={DIGITS}
      filled={passcode.length}
      onNumber={handleNumber}
      onDelete={handleDelete}
      onLoginWithBiometric={handleBiometricUnlock}
      biometry={supportBiometry}
    />
  );
}
