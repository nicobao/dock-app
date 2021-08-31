import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {walletActions} from './wallet-slice';
import {
  Header,
  Content,
  ScreenContainer,
  Typography,
  Box,
  runAfterInteractions,
  Theme,
} from '../../design-system';
import styled from 'styled-components/native';
import {BackButton} from '../../design-system/buttons';
import {translate} from '../../locales';
import {NumericKeyboard} from 'src/components/NumericKeyboard';
import {showToast} from 'src/core/toast';

const Circle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid white;
  margin: 0 7px;
  background-color: ${props =>
    props.filled ? Theme.colors.textHighlighted : Theme.colors.transparent};
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

export function CreatePasscodeScreen({
  digits = 6,
  filled = 2,
  confirmation,
  passcode,
  onPasscodeChange,
}) {
  return (
    <ScreenContainer testID="createPasscodeScreen">
      <Header>
        <BackButton />
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <PasscodeMask marginTop={59} digits={digits} filled={filled} />
        <Box alignItems="center">
          <Typography variant="h2" marginTop={52}>
            {confirmation
              ? translate('create_wallet.confirm_passcode')
              : translate('create_wallet.create_passcode')}
          </Typography>
        </Box>
        <NumericKeyboard
          marginTop={85}
          onChange={onPasscodeChange}
          value={passcode}
        />
      </Content>
    </ScreenContainer>
  );
}

const DIGITS = 6;

export function CreatePasscodeContainer() {
  const [passcode, setPasscode] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const dispatch = useDispatch();

  const handleConfirmation = value => {
    setPasscode('');
    setConfirmation('');

    if (confirmation !== value) {
      showToast({
        message: translate('setup_passcode.match_error'),
        type: 'error',
      });
      return;
    }

    dispatch(walletActions.setPasscode(value));
    navigate(Routes.CREATE_WALLET_PROTECT);
  };

  const handlePasscodeChange = value => {
    if (value.length > DIGITS) {
      return;
    }

    console.log('set value', value);
    setPasscode(value);

    runAfterInteractions(() => {
      if (value.length === DIGITS) {
        if (confirmation) {
          handleConfirmation(value);
        } else {
          setConfirmation(value);
          setPasscode('');
        }
      }
    });
  };

  return (
    <CreatePasscodeScreen
      digits={DIGITS}
      filled={passcode.length}
      passcode={passcode}
      onPasscodeChange={handlePasscodeChange}
      confirmation={confirmation}
    />
  );
}
