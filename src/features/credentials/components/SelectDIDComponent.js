import {NBox, Typography} from '../../../design-system';
import {FormControl, Stack} from 'native-base';
import {translate} from '../../../locales';
import {CustomSelectInput} from '../../../components/CustomSelectInput';
import {addTestId} from '../../../core/automation-utils';
import React from 'react';

export function SelectDIDComponent({dids, handleChange}) {
  return (
    <NBox>
      <FormControl>
        <Stack mt={7}>
          <FormControl.Label>
            {translate('didManagement.did_name')}
          </FormControl.Label>
          <CustomSelectInput
            {...addTestId('DID')}
            onPressItem={item => {
              handleChange(item.value);
            }}
            renderItem={item => {
              return (
                <>
                  <Typography
                    numberOfLines={1}
                    textAlign="left"
                    variant="description">
                    {item.label}
                  </Typography>
                  <Typography
                    numberOfLines={1}
                    textAlign="left"
                    variant="screen-description">
                    {item.description}
                  </Typography>
                </>
              );
            }}
            items={dids}
          />
        </Stack>
      </FormControl>
    </NBox>
  );
}
