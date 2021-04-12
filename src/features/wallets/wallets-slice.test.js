// import sinon from 'sinon';
// import appModule from './index';
// import appActions from './actions';

describe('Wallet Slice', () => {
  let _state = {
    wallets: {
      items: [
        {
          encoded:
            'HJZeKgf2jVbyXo+QDw2wjKZsntTeqNwc5W0nt5GlVDoAgAAAAQAAAAgAAAAeLGat3yoYcbyw6/pa/HteFrktFe+cWdQwUru+7q4S02No88qjxEuY0PPGVF97SKB8EQ6BoAq/ScQbA7rH7y/WtxlJo08j39RuM9VWX63pJhPr0CX7XQovFQIY8jaKUj4AH4W38I6KNStlngAanp/mJ37tUX7uu21xpCQxWPPEVmKo7GR4X1J9pS2rjrGFXsyszUxiU9f87WlbDnhC',
          encoding: {
            content: ['pkcs8', 'ed25519'],
            type: ['scrypt', 'xsalsa20-poly1305'],
            version: '3',
          },
          address: '5FmpCyW1sxpwD9zWQEhPcisiEbtdgYZo48G5JLCdqwbPeMCz',
          meta: {name: 'Test wallet'},
        },
      ],
    }
  };

  let store = {
    dispatch() {},
    getState() {
      return _state;
    },
  };

  beforeEach(() => {
    // sinon.restore();
    // _state = {app: {...appModule.initialState}};
  });

  describe('Reducers', () => {
    it('setAppLoadingReducer', () => {
      // let state = appModule.reducers.setAppLoadingReducer(
      // 	appModule.initialState,
      // 	appActions.setLoading(true),
      // );

      // expect(state.isLoading).toEqual(true);

      // state = appModule.reducers.setAppLoadingReducer(
      // 	appModule.initialState,
      // 	appActions.setLoading(false),
      // );

      // expect(state.isLoading).toEqual(false);
      expect(1).toBe(1);
    });
  });
  describe('Operations', () => {
    // TODO: Mock initRealm function
    // it('loadAppOperation', async () => {
    //   sinon.stub(store, 'dispatch');
    //   sinon.stub(appModule.actions, 'setLoading');
    //   await appModule.operations.loadAppOperation()(store.dispatch, store.getState);
    //   expect(appModule.actions.setLoading.calledWith(true)).toBeTruthy();
    //   expect(appModule.actions.setLoading.calledWith(false)).toBeTruthy();
    // });
  });
});
