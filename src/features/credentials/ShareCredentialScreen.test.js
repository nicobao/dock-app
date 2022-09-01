import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ShareCredentialScreen} from './ShareCredentialScreen';

const mockStore = configureMockStore();

describe('CredentialsScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const wrapper = shallow(
      <ShareCredentialScreen
        selectedCredentials={{}}
        setSelectedCredentials={jest.fn()}
        credentials={[]}
        onPresentCredentials={jest.fn()}
        onNext={jest.fn()}
        step={0}
        dids={[]}
        onSelectDID={jest.fn()}
        isFormValid={true}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
