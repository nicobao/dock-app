import React, {useMemo} from 'react';
import {translate} from '../../../locales';
import {FormControl, Input, Select, Stack} from 'native-base';
import {InputPopover, SelectToggler} from '../../../design-system';

export function DIDAdvancedOptions({onChange, form}) {
  const keypairType = useMemo(() => {
    if (form.didType === 'diddock') {
      return [
        {
          label: translate('did_advenced_options.keypair_type_ed25519'),
          value: 'ed25519',
        },
        {
          label: translate('did_advenced_options.keypair_type_sr25519'),
          value: 'sr25519',
        },
        {
          label: translate('did_advenced_options.keypair_type_ecdsa'),
          value: 'ecdsa',
        },
      ];
    }
    return [
      {
        label: translate('did_advenced_options.keypair_type_ed25519'),
        value: 'ed25519',
      },
    ];
  }, [form.didType]);

  return (
    <SelectToggler
      placeholder={translate('account_advanced_options.advanced_options')}>
      <FormControl>
        <Stack mt={7}>
          <FormControl.Label>
            {translate('account_advanced_options.keypair_type')}
            <InputPopover
              title={translate('account_advanced_options.keypair_type')}>
              {translate('account_advanced_options.keypair_type_tip')}
            </InputPopover>
          </FormControl.Label>
          <Select
            onValueChange={onChange('keypairType')}
            selectedValue={form.keypairType}>
            {keypairType.map(({label, value}, index) => {
              return (
                <Select.Item
                  key={`keypairType_${index}`}
                  label={label}
                  value={value}
                />
              );
            })}
          </Select>
        </Stack>
      </FormControl>
      <FormControl isInvalid={false}>
        <Stack my={7}>
          <FormControl.Label>
            {translate('account_advanced_options.secret_derivation_path')}
            <InputPopover
              title={translate(
                'account_advanced_options.secret_derivation_path',
              )}>
              {translate('account_advanced_options.secret_derivation_path_tip')}
            </InputPopover>
          </FormControl.Label>
          <Input
            placeholder="//hard/soft//password"
            onChangeText={onChange('derivationPath')}
            autoCapitalize="none"
          />
          <FormControl.ErrorMessage>
            {translate('account_advanced_options.invalid_secret_uri')}
          </FormControl.ErrorMessage>
        </Stack>
      </FormControl>
    </SelectToggler>
  );
}
