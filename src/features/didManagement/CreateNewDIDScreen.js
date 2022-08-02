import React from 'react';
import {
  BackButton,
  Box,
  Header,
  IconButton,
  LoadingButton,
  NBox,
  Input,
  ScreenContainer,
  Theme,
  Typography,
} from '../../design-system';
import {navigateBack} from '../../core/navigation';
import {
  FormControl,
  HStack,
  Icon,
  ScrollView,
  Stack,
  VStack,
} from 'native-base';
import {translate} from '../../locales';
import {DIDAdvancedOptions} from './components/DIDAdvancedOptions';
import {Ionicons} from '@native-base/icons';
import {addTestId} from '../../core/automation-utils';
import {useDIDManagementHandlers} from './didHooks';
import QuickInfoIcon from '../../assets/icons/quick-info.svg';
import {CustomSelectInput} from '../../components/CustomSelectInput';

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
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_name')}
            </FormControl.Label>
            <Input
              {...addTestId('DIDName')}
              value={form.didName}
              onChangeText={handleChange('didName')}
              autoCapitalize="none"
            />
            <FormControl.HelperText>
              {translate('didManagement.did_name_input_hint')}
            </FormControl.HelperText>
          </Stack>
        </FormControl>

        <FormControl isInvalid={form._errors.didType}>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_type')}
            </FormControl.Label>
            <CustomSelectInput
              onPressItem={item => {
                handleChange('didType')(item.value);
              }}
              renderItem={item => {
                return (
                  <>
                    <Typography textAlign="left" variant="description">
                      {item.label}
                    </Typography>
                    <Typography textAlign="left" variant="screen-description">
                      {item.description}
                    </Typography>
                  </>
                );
              }}
              items={[
                {
                  value: 'didkey',
                  label: translate('didManagement.did_key'),
                  description: translate('didManagement.did_key_description'),
                },
                {
                  value: 'diddock',
                  label: translate('didManagement.did_dock'),
                  description: translate('didManagement.did_dock_description'),
                },
              ]}
            />
          </Stack>
          <FormControl.ErrorMessage>
            {form._errors.didType}
          </FormControl.ErrorMessage>
        </FormControl>

        {form.didType === 'diddock' && form.showDIDDockQuickInfo ? (
          <VStack
            mt={7}
            px={5}
            pt={3}
            pb={5}
            style={{
              backgroundColor: Theme.colors.bgBlue,
              borderRadius: Theme.borderRadius,
            }}>
            <HStack>
              <HStack
                style={{
                  flexGrow: 1,
                }}>
                <NBox mt={4}>
                  <QuickInfoIcon />
                </NBox>
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
            <Typography textAlign="left" variant="didDescription">
              {translate('didManagement.did_dock_info')}
            </Typography>
          </VStack>
        ) : null}

        <DIDAdvancedOptions
          {...addTestId('DIDAdvancedOptions')}
          onChange={handleChange}
          form={form}
        />
      </ScrollView>
      <LoadingButton
        full
        {...addTestId('CreateNewDIDScreenDIDCreate')}
        mb={70}
        ml={3}
        mr={3}
        onPress={handleSubmit}
        isDisabled={
          form.didType.length <= 0 || form.didName.trim().length <= 0
        }>
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
