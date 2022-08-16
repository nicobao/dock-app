import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {DIDAdvancedOptions} from './DIDAdvancedOptions';

const mockStore = configureMockStore();

describe('DIDAdvancedOptions', () => {
  it('should render correctly for diddock', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didType: 'diddock',
    };
    const wrapper = shallow(
      <DIDAdvancedOptions onChange={jest.fn()} form={form} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly for didkey', () => {
    const initialState = {
      // placeholder for redux store
    };

    const form = {
      didType: 'didkey',
    };
    const wrapper = shallow(
      <DIDAdvancedOptions onChange={jest.fn()} form={form} />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
