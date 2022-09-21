import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {AuthNavigationStackScreen} from './authenticated-stack';
import {Provider} from 'react-redux';

const mockStore = configureMockStore();

const ReduxProvider = ({children, reduxStore}) => (
  <Provider store={reduxStore}>{children}</Provider>
);
describe('AuthNavigationStackScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };
    const store = mockStore(initialState);

    const wrapper = shallow(
      <ReduxProvider reduxStore={store}>
        <AuthNavigationStackScreen />
      </ReduxProvider>,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
