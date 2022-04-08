import {getJsonOrError} from './index';

describe('core', () => {
  it('getJsonOrError', () => {
    const testData = {a: 2};
    expect(getJsonOrError(testData)).toBe(JSON.stringify(testData));

    const circularData = {
      a: {
        b: 2,
      },
    };

    circularData.a.b = circularData;

    expect(getJsonOrError(circularData) instanceof Error).toBeTruthy();
  });
});
