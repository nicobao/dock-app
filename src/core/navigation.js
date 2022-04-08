import {createRef} from 'react';

let history = [];

export const navigationRef = createRef();

export const getNavigationHistory = () => history;
export const clearNavigationHistory = () => (history = []);

export function navigate(name, params, skipFromHistory) {
  if (!navigationRef.current) {
    return;
  }

  navigationRef.current.navigate(name, params);

  if (skipFromHistory) {
    return;
  }

  history.push({
    name,
    params,
  });
}

export function getHistory() {
  return history;
}

export function navigateBack() {
  history.pop();

  if (!history.length) {
    return;
  }

  const {name, params} = history.pop();
  navigate(name, params);
}
