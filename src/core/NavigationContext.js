import React, {useEffect, useState} from 'react';

export const NavigationContext = React.createContext({currentTab: 'tokens'});
export const withNavigationContext = WrappedComponent => props => {
  const [currentTab, setCurrentTab] = useState('tokens');
  const {route} = props;

  useEffect(() => {
    if (route && route.params.currentTab) {
      setCurrentTab(route.params.currentTab);
    }
  }, [route]);

  return (
    <NavigationContext.Provider
      value={{
        currentTab,
      }}>
      <WrappedComponent {...props} />
    </NavigationContext.Provider>
  );
};
