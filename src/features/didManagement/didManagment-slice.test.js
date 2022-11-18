import {didOperations, getDataFromUrl} from './didManagment-slice';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Wallet} from '@docknetwork/wallet-sdk-core/lib/modules/wallet';
import axios from 'axios';

const mockStore = configureMockStore([thunk]);
describe('DID Management', () => {
  it('Create a default DIDs', () => {
    const wallet = Wallet.getInstance();

    const store = mockStore({});
    return store.dispatch(didOperations.initializeDID()).then(() => {
      const docs = wallet.query({});
      expect(docs.length).toBe(2);
      expect(docs[1]).toHaveProperty('didDocument');
      expect(docs[0].correlation[0]).toBe(docs[1].id);
    });
  });
  it('Only create a single DID', async () => {
    const wallet = Wallet.getInstance();
    const store = mockStore({});
    await store.dispatch(didOperations.initializeDID());
    await store.dispatch(didOperations.initializeDID());
    await store.dispatch(didOperations.initializeDID());

    const docs = wallet.query({});
    expect(docs.length).toBe(2);
  });
  it('expect to fetch data from url', async () => {
    const res = await getDataFromUrl('http://dock.io');
    expect(axios.get).toHaveBeenCalledWith('http://dock.io');
    expect(res).toBeDefined();
  });
});
