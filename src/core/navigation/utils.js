export const getScreenProps = ({component, options = {}, name}) => {
  return {
    component: component,
    name: name,
    options: {
      gestureEnabled: false,
      headerShown: false,
      ...options,
    },
  };
};
