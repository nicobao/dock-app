import React, {useCallback} from 'react';
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
export function EditDIDScreen() {
  const onChange = useCallback(() => {}, []);
  return (
    <ScreenContainer testID="CreateNewDIDScreen">
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
              {...addTestId('EditDIDScreenGoBack')}
              value={''}
              onChangeText={onChange('word1')}
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
          onPress={null}
          isDisabled={false}>
          {translate('didManagement.save')}
        </LoadingButton>
      </NBox>
    </ScreenContainer>
  );
}

export function EditDIDScreenContainer() {
  return <EditDIDScreen />;
}
