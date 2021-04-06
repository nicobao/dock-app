import {createRef} from 'react';

export const navigationRef = createRef();

export function navigate(name, params) {
  if (!navigationRef.current) {
    return;
  }

  navigationRef.current.navigate(name, params);
}
