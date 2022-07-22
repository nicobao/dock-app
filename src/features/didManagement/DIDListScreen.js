import React, {useState} from 'react';
import {
  BigButton,
  Box,
  Footer,
  Header,
  IconButton,
  NBox,
  ScreenContainer,
  Typography,
} from '../../design-system';
import {translate} from '../../locales';
import {addTestId} from '../../core/automation-utils';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import {RoundedDIDIcon} from '../../assets/icons';
import {ScrollView} from 'native-base';

import {VStack} from 'native-base';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import {navigate} from '../../core/navigation';
import {Routes} from '../../core/routes';
import {DIDListItem} from './components/DIDListItem';
import {SingleDIDOptionsModal} from './components/SingleDIDOptionsModal';
import {useDIDManagementHandlers} from './didHooks';
import {NewDIDModal} from './components/NewDIDModal';

export function DIDListScreen({didList, onDeleteDID, onImportDID}) {
  const [isDIDOptionsModalVisible, setIsDIDOptionsModalVisible] =
    useState(false);
  const [isCreateDIDModalVisible, setIsCreateDIDModalVisible] = useState(false);
  const [selectedDID, setSelectedDID] = useState(null);

  return (
    <ScreenContainer {...addTestId('DIDListScreen')} showTabNavigation>
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              {translate('app_navigation.did_management')}
            </Typography>
          </Box>
          <Box row>
            <IconButton
              col
              {...addTestId('DIDListScreen_Add_DID')}
              onPress={() => {
                setIsCreateDIDModalVisible(true);
              }}>
              <PlusCircleWhiteIcon />
            </IconButton>
          </Box>
        </Box>
      </Header>
      <ScrollView marginLeft={3} marginRight={3}>
        {didList.length > 0 ? (
          didList.map((didDocumentResolution, i) => {
            return (
              <DIDListItem
                {...addTestId(`DIDListItem_${i}`)}
                key={didDocumentResolution.id}
                onOptionClicked={() => {
                  setSelectedDID(didDocumentResolution);
                  setIsDIDOptionsModalVisible(true);
                }}
                didDocumentResolution={didDocumentResolution}
              />
            );
          })
        ) : (
          <NBox mt={70}>
            <VStack space={7} alignItems="center">
              <RoundedDIDIcon />
              <Typography mt={3} textAlign="center" variant="didDescription">
                {translate('didManagement.did_definition')}
              </Typography>
            </VStack>
          </NBox>
        )}
      </ScrollView>
      {didList.length === 0 ? (
        <Footer marginBottom={114} marginLeft={3} marginRight={3} flex={1}>
          <BigButton
            {...addTestId('CreateNewDID')}
            onPress={() => {
              navigate(Routes.DID_MANAGEMENT_NEW_DID);
            }}
            icon={<PlusCircleIcon />}>
            {translate('didManagement.create_new_did')}
          </BigButton>
          <BigButton
            {...addTestId('ImportExistingDIDBtn')}
            onPress={onImportDID}
            icon={<DocumentDownloadIcon />}>
            {translate('didManagement.import_existing_did')}
          </BigButton>
        </Footer>
      ) : null}
      <SingleDIDOptionsModal
        onDeleteDID={onDeleteDID}
        visible={isDIDOptionsModalVisible && selectedDID}
        didDocumentResolution={selectedDID}
        onClose={() => {
          setIsDIDOptionsModalVisible(false);
          setSelectedDID(null);
        }}
      />
      <NewDIDModal
        onImportDID={onImportDID}
        visible={isCreateDIDModalVisible}
        onClose={() => {
          setIsCreateDIDModalVisible(false);
        }}
      />
    </ScreenContainer>
  );
}
export function DIDListScreenContainer({}) {
  const {onDeleteDID, didList, onImportDID} = useDIDManagementHandlers();
  return (
    <DIDListScreen
      didList={didList}
      onDeleteDID={onDeleteDID}
      onImportDID={onImportDID}
    />
  );
}
