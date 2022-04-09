import React from 'react';
import {render} from '@testing-library/react-native';
// import {shallow} from 'enzyme';
import {GlobalComponents} from './App';
import {renderAppProviders} from './core/test-utils';

describe('App', () => {
  it('should render correctly', async () => {
    const result = render(renderAppProviders(<GlobalComponents />));

    result.debug();

    const webview = await result.findByTestId('wallet-webview');

    expect(webview).toBeTruthy();
  });
});
