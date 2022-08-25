import React from 'react';
import {addTestId} from '../../core/automation-utils';
import {
  BackButton,
  Button,
  Header,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {Icon, ScrollView} from 'native-base';
import {SingleCredentialToShare} from './components/SingleCredentialToShare';
export function ShareCredentialScreen() {
  return (
    <ScreenContainer {...addTestId('ShareCredentialScreen')}>
      <Header>
        <BackButton {...addTestId('BackButton')} />
      </Header>
      <ScrollView mt={7} marginLeft={3} marginRight={3}>
        <Typography variant="h1" mb={2}>
          {translate('credentials.select_what_to_share')}
        </Typography>

        <SingleCredentialToShare />
      </ScrollView>
      <NBox mb={7} mx={7}>
        <Button size="sm" onPress={() => {}}>
          <Typography variant="credentialShareTitle" mb={2}>
            {translate('navigation.next')}
          </Typography>
        </Button>
      </NBox>
    </ScreenContainer>
  );
}

export function ShareCredentialScreenContainer() {
  return <ShareCredentialScreen />;
}
