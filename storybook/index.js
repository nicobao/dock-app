import React from 'react';
import {AppRegistry} from 'react-native';
import {getStorybookUI, configure, addDecorator} from '@storybook/react-native';
import {withKnobs} from '@storybook/addon-knobs';
import {ThemeProvider} from 'styled-components/native';

import './rn-addons';
import {Theme} from '../src/design-system';

// enables knobs for all stories
addDecorator(withKnobs);
addDecorator(getStory => (
  <ThemeProvider theme={Theme}>{getStory()}</ThemeProvider>
));

// import stories
configure(() => {
  require('../src/stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you should remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
