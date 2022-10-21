import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {BuildIdentifier} from './BuildIdentifier';
import {Provider} from 'react-redux';

const mockStore = configureMockStore();

const ReduxProvider = ({children, reduxStore}) => (
  <Provider store={reduxStore}>{children}</Provider>
);
describe('BuildIdentifier', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <ReduxProvider reduxStore={mockStore(initialState)}>
        <BuildIdentifier onUnlock={jest.fn()} />
      </ReduxProvider>,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
