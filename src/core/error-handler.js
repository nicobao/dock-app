import { Stack } from 'native-base';
import React from 'react';
import { Typography } from 'src/design-system';
import { translate } from 'src/locales';

export class ErrorBoundary extends React.Component<any, any> {
   constructor(props: any) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error: any) {
      return { hasError: true };
   }

   componentDidCatch(error: any, errorInfo: any) {
      // TODO: log the error in sentry
      console.error(error);
   }

   render() {
      if (this.state.hasError) {
         return <Stack><Typography>{translate('global.rendering_error')}</Typography></Stack>;
      }

      return this.props.children;
   }
}

export const withErrorBoundary = (WrapperComponent: any) => (props: any) => {
   return (
      <ErrorBoundary>
         <WrapperComponent {...props} />
      </ErrorBoundary>
   );
};
