import {didOperations} from './didManagment-slice';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';
import {DidRpc} from '@docknetwork/react-native-sdk/src/client/did-rpc';

const mockStore = configureMockStore([thunk]);
describe('DID Management Slice', () => {
  it('Create a default DIDs', () => {
    const store = mockStore({});

    return store.dispatch(didOperations.initializeDiDs()).then(() => {
      expect(WalletRpc.query.mock.calls.length).toBe(1);
      expect(DidRpc.createDidKeyPair.mock.calls.length).toBe(1);
      expect(WalletRpc.add.mock.calls.length).toBe(2);
    });
  });
});
