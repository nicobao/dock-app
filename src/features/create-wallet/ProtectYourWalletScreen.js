import React, {useEffect} from 'react';
import {
  Button,
  Header,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  Box,
  BigButton,
  runAfterInteractions,
} from '../../design-system';
import {BackButton} from '../../design-system/buttons';
import EmojiHappyIcon from '../../assets/icons/emoji-happy.svg';
import ArrowRight from '../../assets/icons/arrow-right.svg';
import FingerprintSimple from '../../assets/icons/fingerprint-simple.svg';
import {useDispatch, useSelector} from 'react-redux';
import {walletOperations} from './wallet-slice';
import {appSelectors, BiometryType} from '../app/app-slice';

// const BigButton = ({icon, children, ...props}) => (
//   <Box
//     row
//     borderWidth={1}
//     borderColor="#3F3F46"
//     borderRadius={8}
//     padding={25}
//     marginBottom={12}
//     alignItems="center"
//     {...props}>
//     <Box autoSize col>
//       {icon}
//     </Box>
//     <Box>
//       <Typography
//         fontSize={14}
//         fontFamily="Nunito Sans"
//         fontWeight="600"
//         color="#fff">
//         {children}
//       </Typography>
//     </Box>
//   </Box>
// );

export function ProtectYourWalletScreen({
  onSkip,
  onEnable,
  faceId,
  fingerprint,
}) {
  return (
    <ScreenContainer testID="create-wallet-screen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Typography
          fontFamily="Montserrat"
          fontSize={24}
          lineHeight={32}
          fontWeight="600"
          color="#fff"
          marginTop={52}>
          Protect your wallet
        </Typography>
        <Typography
          fontSize={16}
          lineHeight={24}
          fontWeight="400"
          marginTop={12}>
          Use your biometric to add extra layer of security and easier way to
          access your wallet
        </Typography>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26} flex>
        {/* <Button full icon={<LockClosedIcon />} testID="create-wallet-btn">
          Setup Passcode
        </Button> */}
        {faceId ? (
          <BigButton onPress={onEnable} icon={<EmojiHappyIcon />}>
            Use Face recognition
          </BigButton>
        ) : null}
        {fingerprint ? (
          <BigButton onPress={onEnable} icon={<FingerprintSimple />}>
            Use Fingerprint identification
          </BigButton>
        ) : null}
        <BigButton onPress={onSkip} icon={<ArrowRight />}>
          Do this later
        </BigButton>
      </Footer>
    </ScreenContainer>
  );
}

export function ProtectYourWalletContainer() {
  const dispatch = useDispatch();
  const supportedBiometryType = useSelector(
    appSelectors.getSupportedBiometryType,
  );
  // detect biometry
  let fingerprint = supportedBiometryType === BiometryType.Fingerprint;
  let faceId = supportedBiometryType === BiometryType.FaceId;

  const handleEnable = () => {
    runAfterInteractions(() => dispatch(walletOperations.createWallet({biometry: true})));
  };

  const handleSkip = () => {
    runAfterInteractions(() => dispatch(walletOperations.createWallet()));
  };

  useEffect(() => {
    if (!faceId && !fingerprint) {
      handleSkip();
    }
  }, [faceId, fingerprint]);

  return (
    <ProtectYourWalletScreen
      fingerprint={fingerprint}
      faceId={faceId}
      onEnable={handleEnable}
      onSkip={handleSkip}
    />
  );
}
