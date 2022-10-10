import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {CreateDIDDockConfirmationModal} from './CreateDIDDockConfirmationModal';

const mockStore = configureMockStore();

describe('CreateDIDDockConfirmationModal', () => {
  it('should render correctly when visible', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateDIDDockConfirmationModal
        visible={true}
        didName={'DIDName'}
        didType={'ed25519'}
        onCreateDID={jest.fn()}
        onClose={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
  it('should render correctly when not visible', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <CreateDIDDockConfirmationModal
        visible={false}
        didName={'DIDName'}
        didType={'ed25519'}
        onCreateDID={jest.fn()}
        onClose={jest.fn()}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
