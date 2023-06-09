import React, {useEffect} from 'react';
import {translate} from 'src/locales';
import {PolkadotIcon} from '../../components/PolkadotIcon';
import {
  Box,
  EmptyCredentialIcon,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
  DotsVerticalIcon,
  QRCodeIcon,
} from '../../design-system';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import {addTestId} from '../../core/automation-utils';
import {
  Center,
  Image,
  Text,
  Stack,
  Menu,
  Pressable,
  FlatList,
} from 'native-base';
import {useCredentials, getDIDAddress} from './credentials';
import {formatDate} from '@docknetwork/wallet-sdk-core/lib/core/format-utils';
import {withErrorBoundary} from 'src/core/error-handler';
import {View} from 'react-native';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {PresentationFlow} from './hooks/credentialPresentation';
import {CredentialStatus} from './components/CredentialStatus';
import {useIsFocused} from '@react-navigation/native';
import {useFeatures} from '../app/feature-flags';

function shouldRenderAttr(attr) {
  return attr.property !== 'id' && attr.property !== 'title';
}

export function renderObjectAttributes({attributes}) {
  return (
    <>
      {attributes.map((attr, index) => {
        return (
          shouldRenderAttr(attr) && (
            <Stack mb={1} key={`${index}_${attr.value}`}>
              <Text
                textTransform="capitalize"
                fontSize={'12px'}
                fontWeight={600}
                fontFamily={Theme.fontFamily.montserrat}>
                {attr.name}
              </Text>
              <Text fontSize={'12px'}>{attr.value}</Text>
            </Stack>
          )
        );
      })}
    </>
  );
}

export function EmptyCredentials(props) {
  return (
    <Center {...props}>
      <Box
        borderRadius={72}
        width={72}
        height={72}
        backgroundColor={Theme.colors.iconBackgroundColor}>
        <Center h="100%" width="100%">
          <EmptyCredentialIcon color={Theme.colors.description} />
        </Center>
      </Box>
      <Text
        color={Theme.colors.textHighlighted}
        fontSize={14}
        pt={2}
        fontWeight={400}
        fontFamily={Theme.fontFamily.default}>
        {translate('credentials.empty_items')}
      </Text>
    </Center>
  );
}

export const CredentialListItem = withErrorBoundary(
  ({
    credential,
    formattedData,
    credentialActions = <NBox />,
    onPresentation,
    credentialVerifierEnabled,
  }) => {
    const {title = translate('credentials.default_title')} = formattedData;

    return (
      <NBox
        backgroundColor={Theme.colors.cardItemBackground}
        p={4}
        borderRadius={10}
        m={2}
        key={`${credential.id}`}>
        <Stack direction="row">
          <Stack>
            <View
              style={{
                width: '98%',
              }}>
              <Text
                mb={4}
                fontSize={'16px'}
                fontWeight={600}
                fontFamily={Theme.fontFamily.montserrat}>
                {title}
              </Text>
            </View>
            {formattedData.humanizedType && (
              <Text
                mt={1}
                mb={2}
                fontSize={'12px'}
                fontWeight={500}
                fontFamily={Theme.fontFamily.montserrat}>
                {formattedData.humanizedType}
              </Text>
            )}

            {renderObjectAttributes(formattedData)}
          </Stack>
          <NBox flex={1} alignItems="flex-end">
            <NBox flexDirection="row">
              {Boolean(credentialVerifierEnabled) && (
                <Pressable onPress={onPresentation}>
                  <NBox mt={1}>
                    <QRCodeIcon color={Theme.icons.color} />
                  </NBox>
                </Pressable>
              )}
              {credentialActions}
            </NBox>
          </NBox>
        </Stack>

        <NBox mt={4} flexDirection="row" alignItems={'flex-end'}>
          <NBox>
            <Typography variant={'credentialIssuanceDate'}>
              {formatDate(formattedData.issuanceDate)}
            </Typography>
          </NBox>
          <CredentialStatus credential={credential} />
          <NBox flex={1} alignItems={'flex-end'}>
            {formattedData.image ? (
              <View
                style={{
                  width: 50,
                  height: 50,
                }}>
                <Image
                  borderRadius={8}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  alt={title}
                  source={{
                    uri: formattedData.image,
                  }}
                />
              </View>
            ) : getDIDAddress(credential.issuer) ? (
              <PolkadotIcon
                address={getDIDAddress(credential.issuer)}
                size={32}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                }}>
                <Image
                  borderRadius={8}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  alt={title}
                  source={require('../../assets/circle.png')}
                />
              </View>
            )}
          </NBox>
        </NBox>
      </NBox>
    );
  },
);

export function CredentialsScreen({
  credentials,
  onRemove,
  onAdd,
  refreshing,
  onRefresh,
  credentialVerifierEnabled,
}) {
  return (
    <ScreenContainer {...addTestId('CredentialsScreen')} showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('credentials.title')}
            </Typography>
          </Box>
          <Box row>
            <IconButton onPress={onAdd} col>
              <PlusCircleWhiteIcon
                style={{
                  color: Theme.colors.headerIconColor,
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Header>
      {!credentials.length && <EmptyCredentials mt={'50%'} />}
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={credentials}
        renderItem={({item}) => {
          const credentialActions = (
            <Menu
              bg={Theme.colors.tertiaryBackground}
              trigger={triggerProps => {
                return (
                  <Pressable
                    p={2}
                    {...triggerProps}
                    _pressed={{
                      opacity: Theme.touchOpacity,
                    }}>
                    <DotsVerticalIcon />
                  </Pressable>
                );
              }}>
              <Menu.Item onPress={() => onRemove(item)}>
                {translate('account_list.delete_account')}
              </Menu.Item>
            </Menu>
          );
          return (
            <CredentialListItem
              credentialVerifierEnabled={credentialVerifierEnabled}
              onPresentation={() => {
                navigate(Routes.CREDENTIALS_SHARE_AS_PRESENTATION, {
                  flow: PresentationFlow.qrCode,
                  credentialId: item.id,
                });
              }}
              key={item.id}
              credential={item.content}
              formattedData={item.formattedData}
              credentialActions={credentialActions}
            />
          );
        }}
      />
    </ScreenContainer>
  );
}

export function CredentialsContainer(props) {
  const {credentials, handleRemove, onAdd, refreshing, onRefresh} =
    useCredentials();
  const {features} = useFeatures();
  const isScreenFocus = useIsFocused();

  useEffect(() => {
    if (isScreenFocus) {
      onRefresh();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScreenFocus]);
  return (
    <CredentialsScreen
      credentialVerifierEnabled={features.credentialVerifier}
      credentials={credentials}
      onRemove={handleRemove}
      onAdd={onAdd}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
