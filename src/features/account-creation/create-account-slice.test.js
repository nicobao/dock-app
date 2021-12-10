import {setToast} from '../../core/toast';
import {createAccountOperations} from './create-account-slice';
import {mockState, mockDispatch} from '../../core/test-utils';

describe('Create accounts slice', () => {
  describe('operations', () => {
    describe('checkExistingAccount', () => {
      const toastMock = {
        show: jest.fn(),
      };

      setToast(toastMock);

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

      it('expect account to be found', () => {
        const accountFound = createAccountOperations.checkExistingAccount(1)(
          mockDispatch(),
          mockState('account', state),
        );

        expect(accountFound).toBe(true);
        expect(toastMock.show).toBeCalled();
      });

      it('expect account to not be found', () => {
        toastMock.show.mockReset();

        const accountFound = createAccountOperations.checkExistingAccount(5)(
          mockDispatch(),
          mockState('account', state),
        );

        expect(accountFound).toBe(false);
        expect(toastMock.show).not.toBeCalled();
      });
    });
  });
});
