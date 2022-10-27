import {appSelectors} from './app-slice';
import {defaultFeatures, Features, isFeatureEnabled} from './feature-flags';
import featurConfigFromFile from '../../../features_config.json';

describe('AppSlice', () => {
  describe('isFeatureEnabled', () => {
    it('expect defaults when no configs overridden', () => {
      expect(isFeatureEnabled(Features.accounts.id, [])).toBe(
        Features.accounts.defaultToEnabled,
      );
      expect(isFeatureEnabled(Features.transak.id, [])).toBe(
        Features.transak.defaultToEnabled,
      );
      expect(isFeatureEnabled(Features.showTestnetTransaction.id, [])).toBe(
        Features.showTestnetTransaction.defaultToEnabled,
      );
      expect(isFeatureEnabled(Features.credentials.id, [])).toBe(
        Features.credentials.defaultToEnabled,
      );
      expect(isFeatureEnabled(Features.didManagement.id, [])).toBe(
        Features.didManagement.defaultToEnabled,
      );
    });

    it('expect settings from features_config when no configs overridden', () => {
      const featureDict = featurConfigFromFile
        ? Object.assign(
            {},
            ...featurConfigFromFile.map(f => ({[f.id]: f.enabled})),
          )
        : {};
      expect(isFeatureEnabled(Features.accounts.id)).toBe(
        featureDict[Features.accounts.id],
      );
      expect(isFeatureEnabled(Features.transak.id)).toBe(
        featureDict[Features.transak.id],
      );
      expect(isFeatureEnabled(Features.showTestnetTransaction.id)).toBe(
        // we don't publicize showTestnetTransaction in our config file so just expect the default
        Features.showTestnetTransaction.defaultToEnabled,
      );
      expect(isFeatureEnabled(Features.credentials.id)).toBe(
        featureDict[Features.credentials.id],
      );
      expect(isFeatureEnabled(Features.didManagement.id)).toBe(
        featureDict[Features.didManagement.id],
      );
    });

    it('expect accounts to be overridden by passed in config', () => {
      expect(
        isFeatureEnabled(Features.accounts.id, [
          {
            id: Features.accounts.id,
            enabled: false,
          },
        ]),
      ).toBe(false);
    });

    it('expect transak to be overridden by passed in config', () => {
      expect(
        isFeatureEnabled(Features.transak.id, [
          {
            id: Features.transak.id,
            enabled: false,
          },
        ]),
      ).toBe(false);
    });

    it('expect showTestnetTransaction to be overridden by passed in config', () => {
      expect(
        isFeatureEnabled(Features.showTestnetTransaction.id, [
          {
            id: Features.showTestnetTransaction.id,
            enabled: false,
          },
        ]),
      ).toBe(false);
    });

    it('expect credentials to be overridden by passed in config', () => {
      expect(
        isFeatureEnabled(Features.credentials.id, [
          {
            id: Features.credentials.id,
            enabled: false,
          },
        ]),
      ).toBe(false);
    });

    it('expect didManagement to be overridden by passed in config', () => {
      expect(
        isFeatureEnabled(Features.didManagement.id, [
          {
            id: Features.didManagement.id,
            enabled: false,
          },
        ]),
      ).toBe(false);
    });
  });

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
      ).toEqual(defaultFeatures);

      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: false,
            features: customFeatures,
          },
        }),
      ).toEqual(defaultFeatures);

      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: true,
            features: null,
          },
        }),
      ).toEqual(defaultFeatures);
    });

    it('expect to return custom features', () => {
      expect(
        appSelectors.getFeatures({
          app: {
            devSettingsEnabled: true,
            features: customFeatures,
          },
        }),
      ).toEqual(customFeatures);
    });

    it('expect default features to include accounts feature', () => {
      expect(defaultFeatures.accounts).toBeDefined();
      expect(defaultFeatures.accounts).toBeTruthy();
      expect(Features.accounts).toHaveProperty('id', 'accounts');
      expect(Features.accounts).toHaveProperty('title', 'Show accounts');
    });
  });
});
