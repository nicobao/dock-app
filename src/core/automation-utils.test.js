import {addTestId} from './automation-utils';

describe('Automation utils', () => {
  describe('addTestId', () => {
    it('expect to create accessibilityLabel property', () => {
      const testId = 'someTestId';
      const result = addTestId(testId);
      expect(result.accessibilityLabel).toBe(testId);
      expect(result.testID).toBe(testId);
    });

    it('expect validate testId', () => {
      expect(() => addTestId(null)).toThrowError();
    });
  });
});
