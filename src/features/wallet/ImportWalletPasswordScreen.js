import React from 'react';
import {useDispatch} from 'react-redux';
import {PasswordInputContainer} from '../../components/PasswordInputScreen';
import {walletOperations} from './wallet-slice';

export function ImportWalletPasswordContainer({route}) {
  const dispatch = useDispatch();
  const {fileUri} = route.params;

  const handleSubmit = ({password}) => {
    return dispatch(
      walletOperations.importWallet({
        password,
        fileUri,
      }),
    );
  };

  return <PasswordInputContainer onSubmit={handleSubmit} />;
}
