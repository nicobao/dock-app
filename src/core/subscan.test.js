import {setToast} from './toast';
import {fetchTransactions} from './subscan';

describe('Subscan integration', () => {
  describe('fetchTransactions', () => {
    const toastMock = {
      show: jest.fn(),
    };

    setToast(toastMock);

    const data = {
      items: [],
      count: 60,
    };

    const response = {
      json: () => ({
        data,
      }),
    };

    global.fetch = () => {
      return Promise.resolve(response);
    };

    it('expect to return transactions', async () => {
      const transactions = await fetchTransactions({address: '123'});

      expect(transactions.items).toBe(data.items);
      expect(transactions.hasNextPage).toBe(true);
    });

    it('expect to return transactions (last page)', async () => {
      const transactions = await fetchTransactions({address: '123', page: 2});

      expect(transactions.items).toBe(data.items);
      expect(transactions.hasNextPage).toBe(false);
    });

    it('expect to handle api error', async () => {
      const mockError = new Error('test error');
      response.json = () => {
        throw mockError;
      };
      toastMock.show.mockReset();

      let error;

      try {
        await fetchTransactions({address: '123', page: 2});
      } catch (err) {
        error = err;
      }

      expect(error).toBe(mockError);
      expect(toastMock.show).toBeCalled();
    });
  });
});
