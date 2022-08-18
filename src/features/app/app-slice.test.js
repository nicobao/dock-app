import {appSelectors} from './app-slice';
import {defaultFeatures} from './feature-flags';

describe('AppSlice', () => {
  describe('selectors: getFeatures', () => {
    const customFeatures = {
      ...defaultFeatures,
      someCustomFeature: true,
    };

    it('expect to return defaultFeatures', () => {
      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: false,
            features: null,
          },
        }),
      ).toBe(defaultFeatures);

      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: false,
            features: customFeatures,
          },
        }),
      ).toBe(defaultFeatures);

      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: true,
            features: null,
          },
        }),
      ).toBe(defaultFeatures);
    });

    it('expect to return custom features', () => {
      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: true,
            features: customFeatures,
          },
        }),
      ).toBe(customFeatures);
    });
  });
});
