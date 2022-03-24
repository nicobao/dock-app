import React from 'react';
import {translate} from 'src/locales';
import {navigateBack} from '../../core/navigation';
import {
  BackButton,
  Box,
  Content,
  Header,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {addTestId} from '../../core/automation-utils';

export function CredentialsScreen({}) {
  return (
    <ScreenContainer {...addTestId('CredentialsScreen')} showTabNavigation>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton onPress={navigateBack} />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">
              {translate('credentials.title')}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <Content />
    </ScreenContainer>
  );
}

export function CredentialsContainer(props) {
  console.log('screeen props', props);
  return <CredentialsScreen />;
}
