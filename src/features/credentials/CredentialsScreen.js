import React, {useState} from 'react';
import {translate} from 'src/locales';
import {navigateBack} from '../../core/navigation';
import {
  BackButton,
  Box,
  Content,
  EmptyCredentialIcon,
  Header,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {addTestId} from '../../core/automation-utils';
import {Center, Image, Text} from 'native-base';
import {ICenterProps} from 'native-base/lib/typescript/components/composites/Center/types';
import testCredential from './test-credential.json';
import {useCredentials} from './credentials';

function EmptyCredentials(props: ICenterProps) {
  return (
    <Center {...props}>
      <Box borderRadius={72} width={72} height={72} backgroundColor={'#27272A'}>
        <Center h="100%" width="100%">
          <EmptyCredentialIcon color={Theme.colors.description} />
        </Center>
      </Box>
      <Text
        fontSize={14}
        pt={2}
        fontWeight={400}
        fontFamily={Theme.fontFamily.nunitoSans}>
        You’ll see credentials here once you accept them
      </Text>
    </Center>
  );
}

function CredentialListItem({credential}) {
  return (
    <NBox bgColor="#000000" p={4} borderRadius={10} m={2}>
      <Text
        fontSize={'16px'}
        fontWeight={600}
        fontFamily={Theme.fontFamily.montserrat}>
        {credential.credentialSubject.title}
      </Text>
      <Text
        fontSize={'12px'}
        fontWeight={500}
        fontFamily={Theme.fontFamily.montserrat}>
        {credential.credentialSubject.subjectName}
      </Text>
      <NBox mt={4} flexDirection="row" alignItems={'flex-end'}>
        <NBox>
          <Text
            fontSize={'11px'}
            fontWeight={500}
            fontFamily={Theme.fontFamily.montserrat}>
            Issued on March, 13
          </Text>
        </NBox>
        <NBox flex={1} alignItems={'flex-end'}>
          <Image
            borderRadius={8}
            width={50}
            height={50}
            alt={''}
            source={{
              uri: credential.issuer.logo,
              // body: credential.issuer.logo,
            }}
          />
        </NBox>
      </NBox>
    </NBox>
  );
}

export function CredentialsScreen({credentials, onRemove}) {
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
      <Content>
        {credentials.length ? (
          credentials.map(item => (
            <CredentialListItem
              credential={item}
              onRemove={() => onRemove(item)}
            />
          ))
        ) : (
          <EmptyCredentials mt={'50%'} />
        )}
      </Content>
    </ScreenContainer>
  );
}

export function CredentialsContainer(props) {
  const {credentials, handleRemove} = useCredentials();
  return (
    <CredentialsScreen credentials={credentials} onRemove={handleRemove} />
  );
}
