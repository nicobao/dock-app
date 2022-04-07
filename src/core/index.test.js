import {safeJSONStringify} from './index';

describe('core', () => {
  it('safeJSONStringify', () => {
    const testData = {a: 2};
    expect(safeJSONStringify(testData)).toBe(JSON.stringify(testData));

    const circularData = {
      a: {
        b: 2,
      },
    };

    circularData.a.b = circularData;

    expect(
      safeJSONStringify(circularData).indexOf(
        'TypeError: Converting circular structure to JSON',
      ) === 0,
    ).toBeTruthy();
  });
});
