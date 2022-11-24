import {shallow} from 'enzyme';
import {
  getErrorMessageFromErrorObject,
  renderToastElement,
  setToast,
  typeMap,
  withErrorToast,
} from './toast';
import {translate} from '../locales';
import analytics from '@react-native-firebase/analytics';

describe('Toast', () => {
  it('can get error message from error object', () => {
    const errorObject = new Error('Something went wrong');

    expect(getErrorMessageFromErrorObject(errorObject)).toBe(
      'Something went wrong',
    );

    expect(getErrorMessageFromErrorObject('Oops')).toBe('Oops');
    expect(
      getErrorMessageFromErrorObject(
        '[AssertionError: account already exists]',
      ),
    ).toBe('account already exists');

    expect(getErrorMessageFromErrorObject()).toBe(
      translate('global.unexpected_error'),
    );
  });
  describe('Error toast', () => {
    it('does wrapper error log errors', async () => {
      const errFunction = () => {
        throw new Error('Test Error');
      };
      const func = withErrorToast(errFunction);

      await expect(func('Sample argument')).rejects.toThrowError('Test Error');
      expect(analytics().logEvent).toBeCalledWith('failure', {
        0: 'Sample argument',
        message: 'Test Error',
      });
    });
  });

  describe('toast element', () => {
    beforeAll(() => {
      setToast({
        closeAll: () => {},
      });
    });

    it('should render without errors', () => {
      const message = 'Some message';
      const wrapper = shallow(
        renderToastElement({typeProps: typeMap.success, message}),
      );

      expect(wrapper.dive()).toMatchSnapshot();
    });

    it('should handle non string messages without errors', () => {
      const message = {test: true};
      const wrapper = shallow(
        renderToastElement({typeProps: typeMap.success, message}),
      );

      expect(wrapper.dive()).toMatchSnapshot();
    });

    it('should handle undefined messages without errors', () => {
      const message = 'Some message';
      const wrapper = shallow(
        renderToastElement({typeProps: typeMap.success, message}),
      );

      expect(wrapper.dive()).toMatchSnapshot();
    });
  });
});
