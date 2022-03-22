import {useDispatch, useSelector} from 'react-redux';
import {appOperations, appSelectors} from './app-slice';

export const Features = {
  showTestnetTransaction: 'showTestnetTransaction',
  credentials: 'credentials',
};

export const defaultFeatures = {
  [Features.showTestnetTransaction]: false,
  [Features.credentials]: false,
};

export type FeatureFlags = {
  showTestnetTransaction: boolean,
  credentials: boolean,
};

export function useFeatures() {
  const features: FeatureFlags = useSelector(appSelectors.getFeatures);
  const dispatch = useDispatch();

  console.log('features', features);
  const updateFeature = (name, value) => {
    dispatch(appOperations.updateFeature(name, value));
  };

  return {
    features,
    updateFeature,
  };
}
