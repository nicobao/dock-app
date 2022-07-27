import React from 'react';
import {shallow} from 'enzyme';
import configureMockStore from 'redux-mock-store';
import {ShareDIDScreen} from './ShareDIDScreen';
import {PolkadotIcon} from '../../components/PolkadotIcon';

const mockStore = configureMockStore();

describe('ShareDIDScreen', () => {
  it('should render correctly', () => {
    const initialState = {
      // placeholder for redux store
    };

    const did = 'did:dock:5EfZQN8LKZvqwE9oda4wiognj3217bMj5AaDX4jBgEe3orJk';
    const wrapper = shallow(
      <ShareDIDScreen
        onCopyAddress={jest.fn()}
        did={did}
        didName={'TestDID'}
        accountIcon={<PolkadotIcon address={did} size={32} />}
      />,
      {
        context: {store: mockStore(initialState)},
      },
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
