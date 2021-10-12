import React from 'react';
import {useDispatch} from 'react-redux';
import {PasswordInputContainer} from '../../components/PasswordInputScreen';
import {createAccountOperations} from '../account-creation/create-account-slice';

export function ImportAccountPasswordContainer({route}) {
  const dispatch = useDispatch();

  const handleSubmit = ({password}) => {
    return dispatch(createAccountOperations.unlockJson(password));
  };

  return <PasswordInputContainer onSubmit={handleSubmit} />;
}
