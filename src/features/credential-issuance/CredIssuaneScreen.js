import {
  Footer,
  Content,
  Button,
  Text,
  Container,
  View,
  Item,
  Label,
  Input,
  H1,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {credIssuanceOperations,credIssuanceSelectors} from './cred-issuance-slice';
import jp from 'jsonpath';

export function CredIssuanceScreen() {
  const dispatch = useDispatch();
  const manifest = useSelector(credIssuanceSelectors.getManifest);
  const schema = useSelector(credIssuanceSelectors.getSchema);
  const isLoading = useSelector(credIssuanceSelectors.getLoading);
  const properties = manifest && manifest.output_descriptors[0].display.properties || [];
  const [form, setForm] = useState({});

  const handleFormChange = (path) => (newValue) => {
    const newForm = {...form};
    jp.value(newForm, path, newValue);
    setForm(newForm);
  };

  useEffect(() => {
    dispatch(credIssuanceOperations.fetch());
  }, []);

  return (
    <Container>
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <View>
            <H1>Credential Manifest</H1>
            {
              properties.map((item) => {
                return (
                  <Item floatingLabel>
                    <Label>{item.label}</Label>
                    <Input
                      onChangeText={handleFormChange(item.path[0])}
                      value={jp.value(form, item.path[0])}
                    />
                  </Item>
                );
              })
            }
          </View>
        )}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={() => {}}>
          <Text style={{color: '#fff'}}>Submit</Text>
        </Button>
      </Footer>
    </Container>
  );
}
