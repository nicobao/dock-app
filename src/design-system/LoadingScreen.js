import React from 'react';
import {translate} from 'src/locales';
import {Content, Header, ScreenContainer, Typography} from './index';

export function LoadingScreen({}) {
  return (
    <ScreenContainer testID="LoadingScreen">
      <Header />
      <Content marginLeft={26} marginRight={26}>
        <Typography>{translate('loading_screen.message')}</Typography>
      </Content>
    </ScreenContainer>
  );
}
