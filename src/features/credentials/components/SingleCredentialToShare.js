import React from 'react';
import {Checkbox} from 'native-base';

import {withErrorBoundary} from '../../../core/error-handler';
import {CredentialListItem} from '../CredentialsScreen';

export const SingleCredentialToShare = withErrorBoundary(
  ({rawCredential, isChecked, onSelect}) => {
    const credentialActions = (
      <Checkbox
        isChecked={isChecked}
        onChange={onSelect}
        accessibilityLabel="Select credential"
      />
    );
    return (
      <CredentialListItem
        credential={rawCredential.content}
        formattedData={rawCredential.formattedData}
        credentialActions={credentialActions}
      />
    );
  },
);
