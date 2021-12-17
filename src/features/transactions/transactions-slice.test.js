import {parseTransaction, sortTransactions} from './transactions-slice';

describe('transactions-slice', () => {
  it('expect to parse transaction', () => {
    const t1 = {
      date: new Date(),
    };

    const t2 = {
      date: new Date().toString(),
    };

    expect(parseTransaction(t1)).toBe(t1);
  });
  
  it('expect to sort transactions', () => {
    const baseTime = Date.now();
    const t1 = {
      date: new Date(baseTime + 1000),
    };

    const t2 = {
      date: new Date(baseTime + 2000),
    };
    
    const t3 = {
      date: new Date(baseTime + 3000),
    };
    
    const t4 = {
      date: new Date(baseTime + 4000),
    };
    
    const list = [t2, t1, t3, t4];
    const sorted = list.sort(sortTransactions);
    
    expect(sorted[0]).toBe(t4);
    expect(sorted[1]).toBe(t3);
    expect(sorted[2]).toBe(t2);
    expect(sorted[3]).toBe(t1);
  });
});
