import {useDispatch, useSelector} from 'react-redux';
import {appOperations, appSelectors} from './app-slice';
import {translate} from '../../locales';
import {ANALYTICS_EVENT, logAnalyticsEvent} from '../analytics/analytics-slice';
import featureConfig from '../../../features_config.json';

export const Features = {
  accounts: {
    id: 'accounts',
    title: translate('dev_settings.show_accounts'),
  },
  showTestnetTransaction: {
    id: 'showTestnetTransaction',
    title: translate('dev_settings.show_testnet_transaction'),
    visible: ({currentNetworkId}) => currentNetworkId !== 'mainnet',
  },
  credentials: {
    id: 'credentials',
    title: translate('dev_settings.show_credentials'),
  },
  didManagement: {
    id: 'didManagement',
    title: translate('dev_settings.show_did_management'),
  },
  transak: {
    id: 'activate_transak',
    title: translate('dev_settings.activate_transak'),
  },
};

export const getAllFeatures = () =>
  Object.keys(Features).map(key => Features[key]);

const featureDict = featureConfig
  ? Object.assign({}, ...featureConfig.map(f => ({[f.id]: f.enabled})))
  : {};

export const defaultFeatures = {
  [Features.accounts.id]: featureDict[Features.accounts.id] ?? true,
  [Features.showTestnetTransaction.id]: false,
  [Features.credentials.id]: featureDict[Features.credentials.id] ?? true,
  [Features.transak.id]: featureDict[Features.transak.id] ?? true,
  [Features.didManagement.id]: featureDict[Features.didManagement.id] ?? true,
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
