import React, {useCallback, useEffect, useState} from 'react';
import {
  BackButton,
  Box,
  Header,
  Input,
  LoadingButton,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {navigateBack} from '../../core/navigation';
import {translate} from '../../locales';
import {FormControl, ScrollView, Stack} from 'native-base';
import {addTestId} from '../../core/automation-utils';
import {useDIDManagementHandlers} from './didHooks';
export function EditDIDScreen({handleChange, form, handleSubmit}) {
  return (
    <ScreenContainer {...addTestId('EditDIDScreen')}>
      <Header>
        <Box
          marginLeft={1}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <NBox width={'80px'}>
            <BackButton
              {...addTestId('EditDIDScreenGoBack')}
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
              {translate('didManagement.edit_did')}
            </Typography>
          </NBox>
          <NBox width="80px" alignItems="flex-end" />
        </Box>
      </Header>
      <ScrollView marginLeft={5} marginRight={5}>
        <FormControl>
          <Stack mt={7}>
            <FormControl.Label>
              {translate('didManagement.did_name')}
            </FormControl.Label>
            <Input
              {...addTestId('EditDIDScreenDIDName')}
              value={form.didName}
              onChangeText={handleChange('didName')}
              autoCapitalize="none"
            />
          </Stack>
        </FormControl>
      </ScrollView>
      <NBox mx={7}>
        <LoadingButton
          {...addTestId('EditDIDScreenSave')}
          full
          testID="save-btn"
          mb={70}
          onPress={handleSubmit}
          isDisabled={form.didName.trim().length <= 0}>
          {translate('didManagement.save')}
        </LoadingButton>
      </NBox>
    </ScreenContainer>
  );
}

export function EditDIDScreenContainer({route}) {
  const {didDocumentResolution} = route.params;
  const {form, onEditDID, handleChange} = useDIDManagementHandlers();

  useEffect(() => {
    if (didDocumentResolution) {
      handleChange('id')(didDocumentResolution.id);
      handleChange('didName')(
        didDocumentResolution.name ? didDocumentResolution.name : '',
      );
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditDIDScreen
      handleChange={handleChange}
      form={form}
      handleSubmit={onEditDID}
    />
  );
}
