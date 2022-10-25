import {useDispatch, useSelector} from 'react-redux';
import {appOperations, appSelectors} from './app-slice';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import featureConfig from '../../../features_config.json';

export const Features = {
  accounts: {
    id: 'accounts',
    title: translate('dev_settings.show_accounts'),
    defaultToEnabled: true,
  },
  showTestnetTransaction: {
    id: 'showTestnetTransaction',
    title: translate('dev_settings.show_testnet_transaction'),
    visible: ({currentNetworkId}) => currentNetworkId !== 'mainnet',
    defaultToEnabled: false,
  },
  credentials: {
    id: 'credentials',
    title: translate('dev_settings.show_credentials'),
    defaultToEnabled: true,
  },
  didManagement: {
    id: 'didManagement',
    title: translate('dev_settings.show_did_management'),
    defaultToEnabled: true,
  },
  transak: {
    id: 'activate_transak',
    title: translate('dev_settings.activate_transak'),
    defaultToEnabled: true,
  },
};

export const getAllFeatures = () =>
  Object.keys(Features).map(key => Features[key]);

export const isFeatureEnabled = (id, config = featureConfig) => {
  const entry = config && config.find(f => f.id === id);

  // if no override found, return the defaults
  if (!entry) {
    const defaultEntry = getAllFeatures().find(f => f.id === id);
    return defaultEntry && defaultEntry.defaultToEnabled;
  }

  return entry && entry.enabled;
};

export const defaultFeatures = {
  [Features.accounts.id]: isFeatureEnabled(Features.accounts.id),
  [Features.showTestnetTransaction.id]: isFeatureEnabled(
    Features.showTestnetTransaction.id,
  ),
  [Features.credentials.id]: isFeatureEnabled(Features.credentials.id),
  [Features.transak.id]: isFeatureEnabled(Features.transak.id),
  [Features.didManagement.id]: isFeatureEnabled(Features.didManagement.id),
};

export type FeatureFlags = {
  showTestnetTransaction: boolean,
  credentials: boolean,
};

export function useFeatures() {
  const features: FeatureFlags = useSelector(appSelectors.getFeatures);
  const dispatch = useDispatch();

  const updateFeature = (name, value) => {
    dispatch(appOperations.updateFeature(name, value));
    logAnalyticsEvent(ANALYTICS_EVENT.SETTINGS.TOGGLE_FEATURE_FLAG, {
      name,
      value,
    });
  };

  return {
    features,
    updateFeature,
  };
}
