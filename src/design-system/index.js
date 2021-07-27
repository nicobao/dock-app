import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Box } from './grid';

export const ScreenContainer = styled.SafeAreaView`
  background-color: ${props => props.theme.screen.backgroundColor};
  flex: 1;
`;

export const Header = styled.View`
  padding: 22px 6px;
`;
export const Footer = styled(Box)``;
export const Content = styled(ScrollView)`
  flex: 1;
`;

export const Image = styled.Image``;

export * from '../assets/icons';
export * from './buttons';
export * from './grid';
export * from './inputs';
export * from './list';
export * from './LoadingScreen';
export * from './theme';
export * from './typography';

