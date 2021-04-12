import {
  Footer,
  Content,
  Button,
  Text,
  Container,
  H1,
  View,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Row,
  Grid,
  Col,
  Picker,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenSpinner} from '../../components/ScreenSpinner';
import {didOperations, didSelectors} from './did-slice';
import styled from 'styled-components/native';
import {Modal} from '../../components/Modal';
import {Colors} from '../../theme/colors';
import {WalletPicker} from '../wallets/UnlockWalletScreen';
import { Dimensions } from 'react-native';

const Divier = styled(View)`
  margin: 20px 0;
  border: 0 solid #ccc;
  border-bottom-width: 1px;
`;

function DetailsValue({label, value}) {
  return (
    <View style={{marginBottom: 12}}>
      <Text style={{marginBottom: 5}}>{label}</Text>
      <Text style={{color: '#666', fontSize: 13}}>{value}</Text>
    </View>
  );
}

function DIDEditModal({items, onClose, onEdit, itemDetails}) {
  const [newController, setNewController] = useState(itemDetails.publicKey[0].controller);

  return (
    <Modal visible={true} onClose={onClose}>
      <Grid>
        <Row
          style={{
            alignItems: 'center',
            height: 70,
            backgroundColor: Colors.darkBlue,
            padding: 10,
          }}>
          <Col style={{width: 50}}>
            <Button transparent onPress={onClose}>
              <Icon name="chevron-back-outline" style={{color: 'white'}} />
              {/* <Text style={{color: '#fff'}}>Delete</Text> */}
            </Button>
          </Col>
          <Col>
            <H1 style={{color: '#fff'}}>Update DID</H1>
          </Col>
        </Row>
        <Row style={{padding: 10, flex: 1}}>
          <Col>
            <DetailsValue label="Id" value={itemDetails.id} />
            {/* <DetailsValue
              label="Controller"
              value={}
            /> */}
            <Text style={{}}>Controller</Text>
            <Picker
              note
              mode="dropdown"
              style={{width: Dimensions.get('screen').width, height: 100}}
              iosIcon={<Icon name="arrow-down" />}
              placeholder="Select a DID"
              placeholderStyle={{color: '#333'}}
              selectedValue={newController}
              onValueChange={(v) => setNewController(v)}>
              {items.map(item => (
                <Picker.Item
                  label={
                    <View style={{paddingTop: 8, paddingLeft: 5}}>
                      <Text style={{color: '#555'}}>{item.id}</Text>
                    </View>
                  }
                  value={item.id}
                  key={item.id}
                />
              ))}
            </Picker>
            <View style={{marginTop: 12}}>
              <Button full disabled={!newController}>
                <Text style={{color: 'white'}}>Confirm Update</Text>
              </Button>
            </View>
          </Col>
        </Row>
      </Grid>
    </Modal>
  );
}

function DIDDetailsModal({onClose, itemDetails, onEdit, onDelete}) {
  return (
    <Modal visible={true} onClose={onClose}>
      <Grid>
        <Row
          style={{
            alignItems: 'center',
            height: 70,
            backgroundColor: Colors.darkBlue,
            padding: 10,
          }}>
          <Col>
            <H1 style={{color: '#fff'}}>DID Details</H1>
          </Col>
          <Col style={{width: 120, flexDirection: 'row'}}>
            <Button transparent onPress={onEdit} style={{marginRight: 8}}>
              <Icon name="pencil" style={{color: 'white'}} />
              {/* <Text style={{color: '#fff'}}>Delete</Text> */}
            </Button>
            <Button transparent onPress={onDelete}>
              <Icon name="trash" style={{color: 'white'}} />
              {/* <Text style={{color: '#fff'}}>Delete</Text> */}
            </Button>
          </Col>
        </Row>
        <Row style={{padding: 10, marginTop: 8}}>
          <Col>
            <DetailsValue label="Id" value={itemDetails.id} />

            <DetailsValue
              label="Authentication"
              value={itemDetails.authentication}
            />

            <DetailsValue
              label="Assertion Method"
              value={itemDetails.assertionMethod}
            />

            <DetailsValue
              label="Controller"
              value={itemDetails.publicKey[0].controller}
            />
            <DetailsValue
              label="Public Key Type"
              value={itemDetails.publicKey[0].type}
            />
            <DetailsValue
              label="Public Key Base58"
              value={itemDetails.publicKey[0].publicKeyBase58}
            />
          </Col>
        </Row>
      </Grid>
    </Modal>
  );
}

export function DIDListScreen({navigation}) {
  const dispatch = useDispatch();
  const items = useSelector(didSelectors.getItems);
  const isLoading = useSelector(didSelectors.getLoading);
  const [itemDetails, setItemDetails] = useState();
  const [showEditModal, setShowEditModal] = useState();

  const handleCreate = () => {
    dispatch(didOperations.createDID());
  };

  const handleDelete = () => {
    dispatch(didOperations.removeDID(itemDetails));
    setItemDetails(null);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  useEffect(() => {
    dispatch(didOperations.fetch());
  }, []);

  return (
    <Container>
      {/* <Header style={{alignItems: 'center', marginTop: 10}}>
        <H1>DIDs</H1>
      </Header> */}
      <Content>
        {isLoading ? (
          <ScreenSpinner />
        ) : (
          <List>
            {(items || []).map(item => (
              <ListItem onPress={() => setItemDetails(item)}>
                <Left>
                  <Text style={{color: '#444', fontSize: 14}}>{item.id}</Text>
                </Left>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            ))}
          </List>
        )}
        {showEditModal ? (
          <DIDEditModal
            itemDetails={itemDetails}
            onClose={() => setShowEditModal(false)}
            items={items}
          />
        ) : null}
        {!showEditModal && itemDetails ? (
          <DIDDetailsModal
            onClose={() => setItemDetails(null)}
            itemDetails={itemDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : null}
      </Content>
      <Footer style={{backgroundColor: '#fff', padding: 8}}>
        <Button full style={{width: '100%'}} primary onPress={handleCreate}>
          <Text style={{color: '#fff'}}>Create DID</Text>
        </Button>
      </Footer>
    </Container>
  );
}
