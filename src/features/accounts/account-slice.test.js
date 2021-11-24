import {accountReducers} from './account-slice';

describe('AccountSlice', () => {
  it('expect to remove account from store', () => {
    const state = {
      accounts: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
    };

    accountReducers.removeAccount(state, {
      payload: 2,
    });

    expect(state.accounts.length).toBe(2);
    expect(state.accounts[0].id).toBe(1);
    expect(state.accounts[1].id).toBe(3);
  });

  it('expect to update account in the store', () => {
    const state = {
      accounts: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
    };

    accountReducers.setAccount(state, {
      payload: {
        id: 2,
        newProp: true,
      },
    });

    expect(state.accounts.length).toBe(3);
    expect(state.accounts[1].newProp).toBe(true);
  });
});
