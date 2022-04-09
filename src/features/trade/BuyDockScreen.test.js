import {shallow} from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import {BuyDockScreenScreen} from './BuyDockScreen';
import thunk from 'redux-thunk';
import {renderAppProviders} from '../../core/test-utils';
import TransakProvider, {
  TransakIntroView,
  TransakWebView,
} from './components/TransakProvider';
import queryString from 'query-string';

const mockStore = configureMockStore([thunk]);

describe('BuyDockScreenScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <BuyDockScreenScreen
        walletAddress={'3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB'}
        orderId={'fd1b4a14-f4be-4218-9e76-4aec9c00db69'}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render TransakProvider correctly', () => {
    const wrapper = shallow(
      renderAppProviders(
        <TransakProvider
          walletAddress={'3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB'}
          partnerOrderId={'fd1b4a14-f4be-4218-9e76-4aec9c00db69'}
        />,
      ),
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render TransakIntro Component', () => {
    const wrapper = shallow(
      renderAppProviders(<TransakIntroView onPress={jest.fn()} />),
    );

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should render TransakProvider Webview', () => {
    const queryUrl = queryString.stringify({
      partnerOrderId: 'fd1b4a14-f4be-4218-9e76-4aec9c00db69',
      cryptoCurrencyCode: 'DOCK',
      walletAddress: '3C7Hq5jQGxeYzL7LnVASn48tEfr6D7yKtNYSuXcgioQoWWsB',
    });
    const wrapper = shallow(<TransakWebView queryUrl={queryUrl} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
