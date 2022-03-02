import assert from 'assert';

export function addTestId(testId) {
  assert(!!testId, 'Test id is required');

  return {
    testID: testId,
    accessibilityLabel: testId,
  };
}
