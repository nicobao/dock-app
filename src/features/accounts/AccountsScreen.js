import React from 'react';
import {
  Header,
  Button,
  Footer,
  Content,
  ScreenContainer,
  Typography,
  Box,
} from '../../design-system';
import DocumentDownloadIcon from '../../assets/icons/document-download.svg';
import PlusCircleIcon from '../../assets/icons/plus-circle.svg';
import PlusCircleWhiteIcon from '../../assets/icons/plus-circle-white.svg';
import CogIcon from '../../assets/icons/cog.svg';

const BigButton = ({icon, children, ...props}) => (
  <Box
    row
    borderWidth={1}
    borderColor="#3F3F46"
    borderRadius={8}
    padding={25}
    marginBottom={12}
    alignItems="center"
    {...props}>
    <Box autoSize col>
      {icon}
    </Box>
    <Box>
      <Typography fontSize={14} fontFamily="Nunito Sans" fontWeight="600" color="#fff">
        {children}
      </Typography>
    </Box>
  </Box>
);

export function AccountsScreen() {
  return (
    <ScreenContainer testID="accounts-screen">
      <Header>
        <Box marginLeft={22} marginRight={22} flexDirection="row" alignItems="center">
          <Box flex>
            <Typography fontFamily="Montserrat" fontSize={24} fontWeight="600">
              Accounts
            </Typography>
          </Box>
          <Box row>
            <Box col marginRight={10}>
              <PlusCircleWhiteIcon />
            </Box>
            <Box col>
              <CogIcon />
            </Box>
          </Box>
        </Box>
      </Header>
      <Content marginLeft={26} marginRight={26}>
        <Box flex justifyContent="center" alignItems="center">
          <Typography
            fontSize={16}
            lineHeight={24}
            fontWeight="400"
            marginTop={12}>
            You don’t have any accounts yet.
          </Typography>
        </Box>
      </Content>
      <Footer marginBottom={114} marginLeft={26} marginRight={26} flex>
        <BigButton
          onPress={() => alert('fingerprint')}
          icon={<PlusCircleIcon />}>
          Create new account
        </BigButton>
        <BigButton
          onPress={() => alert('later')}
          icon={<DocumentDownloadIcon />}>
          Import existing account
        </BigButton>
      </Footer>
    </ScreenContainer>
  );
}
