import React, {useEffect} from 'react';
import {
  Header,
  // Button,
  Footer,
  Content,
  Text,
  ScreenContainer,
  Typography,
  Box,
  NBox,
  BigButton,
  DotsVerticalIcon,
  CheckCircleIcon,
} from '../../design-system';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import CogIcon from '../../assets/icons/cog.svg';
import {
  Avatar,
  Button,
  ChevronLeftIcon,
  Divider,
  IconButton,
  Menu,
  Pressable,
  Stack,
  useToast,
} from 'native-base';
import {TouchableWithoutFeedback} from 'react-native';
import {showToast} from '../../core/toast';
import {useDispatch, useSelector} from 'react-redux';
import {accountOperations, accountSelectors} from './account-slice';

// const BigButton = ({icon, children, ...props}) => (
//   <Box
//     row
//     borderWidth={1}
//     borderColor="#3F3F46"
//     borderRadius={8}
//     padding={25}
//     marginBottom={12}
//     alignItems="center"
//     {...props}>
//     <Box autoSize col>
//       {icon}
//     </Box>
//     <Box>
//       <Typography
//         fontSize={14}
//         fontFamily="Nunito Sans"
//         fontWeight="600"
//         color="#fff">
//         {children}
//       </Typography>
//     </Box>
//   </Box>
// );

export function AccountsScreen({
  accounts = [],
  onAddAccount,
  onDelete,
  onEdit,
}) {
  const isEmpty = accounts.length === 0;
  const toast = useToast();

  useEffect(() => {}, []);

  return (
    <ScreenContainer testID="accounts-screen">
      <Header>
        <Box
          marginLeft={22}
          marginRight={22}
          flexDirection="row"
          alignItems="center">
          <Box flex>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              Accounts
            </Typography>
          </Box>
          <Box row>
            <Box col marginRight={10} onPress={onAddAccount}>
              <PlusCircleWhiteIcon />
            </Box>
            <Box col>
              <CogIcon />
            </Box>
          </Box>
        </Box>
      </Header>
      <Content marginLeft={26} marginRight={26}>
        {isEmpty ? (
          <Box flex justifyContent="center" alignItems="center">
            <Typography
              fontSize={16}
              lineHeight={24}
              fontWeight="400"
              marginTop={12}>
              You don’t have any accounts yet.
            </Typography>
          </Box>
        ) : (
          <NBox>
            {accounts.map(account => {
              return (
                <Stack
                  direction="row"
                  borderRadius={12}
                  backgroundColor="#27272A"
                  space={2}
                  mb={4}
                  py={6}
                  px={4}>
                  <Avatar width="48px" height="48px" bgColor="white"></Avatar>
                  <Stack direction="column" flex={1}>
                    <Text color="#fff" fontWeight={600}>
                      {account.meta.name}
                    </Text>
                    <Text color="#D4D4D8">
                      {account.meta.balance.value} {account.meta.balance.symbol}
                    </Text>
                  </Stack>
                  <NBox py={1} px={1}>
                    <Menu
                      trigger={triggerProps => {
                        return (
                          <Pressable {...triggerProps}>
                            <DotsVerticalIcon />
                          </Pressable>
                        );
                      }}>
                      <Menu.Item onPress={() => onDelete(account)}>
                        Delete
                      </Menu.Item>
                      <Menu.Item onPress={() => onEdit(account)}>
                        Edit
                      </Menu.Item>
                    </Menu>
                  </NBox>
                </Stack>
              );
            })}
          </NBox>
        )}
      </Content>
      {isEmpty ? (
        <Footer marginBottom={114} marginLeft={26} marginRight={26} flex>
          <BigButton onPress={onAddAccount} icon={<PlusCircleIcon />}>
            Create new account
          </BigButton>
          <BigButton
            onPress={() => alert('Available soon')}
            icon={<DocumentDownloadIcon />}>
            Import existing account
          </BigButton>
        </Footer>
      ) : null}
    </ScreenContainer>
  );
}

export function AccountsContainer() {
  const dispatch = useDispatch();
  const accounts = useSelector(accountSelectors.getAccounts);
  useEffect(() => {
    dispatch(accountOperations.loadAccounts());
  }, []);

  return (
    <AccountsScreen
      onDelete={accountId => {
        dispatch(accountOperations.removeAccount(accountId));
      }}
      onEdit={() => {
        alert('edit');
      }}
      accounts={accounts}
      onAddAccount={() => {
        dispatch(accountOperations.addAccountFlow());
      }}
    />
  );
}

// [
//   {
//     id: 1,
//     name: 'cocomelon',
//     balance: {
//       value: 0,
//       symbol: 'DOCK',
//     },
//   },
// ]
