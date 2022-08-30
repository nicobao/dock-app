import {NBox, Typography} from '../../../design-system';
import {translate} from '../../../locales';
import {SingleCredentialToShare} from './SingleCredentialToShare';
import {EmptyCredentials} from '../CredentialsScreen';
import React from 'react';
import {addTestId} from '../../../core/automation-utils';

export function SelectCredentialsComponent({
  credentials,
  selectedCredentials,
  setSelectedCredentials,
}) {
  return (
    <NBox>
      <Typography variant="h1" mb={2}>
        {translate('credentials.select_what_to_share')}
      </Typography>

      {credentials.length > 0 ? (
        credentials.map((item, index) => (
          <SingleCredentialToShare
            {...addTestId(`credentials_${index}`)}
            key={item.id}
            rawCredential={item}
            checked={selectedCredentials[item.id]}
            onSelect={isSelected => {
              setSelectedCredentials(prev => {
                return {
                  ...prev,
                  [item.id]: isSelected ? item.content : undefined,
                };
              });
            }}
          />
        ))
      ) : (
        <EmptyCredentials mt={'50%'} />
      )}
    </NBox>
  );
}
