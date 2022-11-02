import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {NewDIDModal} from './NewDIDModal';

const mockStore = configureMockStore();

describe('NewDIDModal', () => {
  it('should render correctly for modal is visible', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <NewDIDModal
        onImportDID={jest.fn()}
        visible={true}
        onClose={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly for modal is not visible', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <NewDIDModal
        onImportDID={jest.fn()}
        visible={false}
        onClose={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
