import React, {useMemo, useState} from 'react';
import {
  BackButton,
  Box,
  Header,
  IconButton,
  LoadingButton,
  NBox,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {navigateBack, navigate} from '../../core/navigation';
import {
  FormControl,
  HStack,
  Icon,
  ScrollView,
  Select,
  Stack,
  VStack,
} from 'native-base';
import {translate} from '../../locales';
import {DIDAdvancedOptions} from './components/DIDAdvancedOptions';
import {Ionicons} from '@native-base/icons';
import {addTestId} from '../../core/automation-utils';
import {useDIDManagement, useDIDManagementHandlers} from './didHooks';
import {Routes} from '../../core/routes';
import {showToast} from '../../core/toast';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';

export function CreateNewDIDScreen({form, handleChange, handleSubmit}) {
  return (
    <ScreenContainer {...addTestId('CreateNewDIDScreen')}>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton
              {...addTestId('CreateNewDIDScreenGoBack')}
              onPress={navigateBack}
            />
          </NBox>
          <NBox
            flex={1}
            width="100%"
            alignContent="center"
            alignItems="center"
            pl={15}>
            <Typography variant="h3">
              {translate('didManagement.create_new_did')}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <ScrollView marginLeft={3} marginRight={3}>
        <FormControl isInvalid={form._errors.didType}>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_type')}
            </FormControl.Label>
            <Select
              onValueChange={handleChange('didType')}
              selectedValue={form.didType}>
              <Select.Item label="did:key" value="didkey" />
              <Select.Item label="did:dock" value="diddock" />
            </Select>
          </Stack>
          <FormControl.ErrorMessage>
            {form._errors.didType}
          </FormControl.ErrorMessage>
        </FormControl>

        {form.didType === 'diddock' && form.showDIDDockQuickInfo ? (
          <VStack
            mt={7}
            px={5}
            py={5}
            style={{
              backgroundColor: Theme.colors.bgBlue,
              borderRadius: Theme.borderRadius,
            }}>
            <HStack>
              <HStack
                style={{
                  flexGrow: 1,
                }}>
                <Icon mt={2} as={Ionicons} name="information-circle-outline" />
                <Typography mt={2} ml={1} variant="h3">
                  {' ' + translate('didManagement.quick_info')}
                </Typography>
              </HStack>
              <IconButton
                {...addTestId('CreateNewDIDScreenCloseQuickInfo')}
                onPress={() => {
                  handleChange('showDIDDockQuickInfo')(false);
                }}>
                <Icon as={Ionicons} name="close-outline" />
              </IconButton>
            </HStack>
            <Typography mt={3} textAlign="left" variant="didDescription">
              {translate('didManagement.did_dock_info')}
            </Typography>

            <Typography my={2} color={Theme.colors.inactiveText}>
              {translate('didManagement.learn_more') + ' '}
              <Icon as={Ionicons} name="open-outline" size="xs" />
            </Typography>
          </VStack>
        ) : null}

        <DIDAdvancedOptions onChange={handleChange} form={form} />
      </ScrollView>
      <LoadingButton
        full
        {...addTestId('CreateNewDIDScreenDIDCreate')}
        mb={70}
        ml={3}
        mr={3}
        onPress={handleSubmit}
        isDisabled={form.didType.length <= 0}>
        {translate('didManagement.create')}
      </LoadingButton>
    </ScreenContainer>
  );
}
export function CreateNewDIDScreenContainer() {
  const {form, onCreateDID, handleChange} = useDIDManagementHandlers();

  return (
    <CreateNewDIDScreen
      handleChange={handleChange}
      form={form}
      handleSubmit={onCreateDID}
    />
  );
}
