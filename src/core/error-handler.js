import {Stack} from 'native-base';
import React from 'react';
import {Typography} from 'src/design-system';
import {translate} from 'src/locales';
import {captureException} from '@sentry/react-native';

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    if (this.props.disableLogs) {
      return;
    }

    captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack>
          <Typography>{translate('global.rendering_error')}</Typography>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export const withErrorBoundary = (WrapperComponent: any, { 
  disableLogs
}) => (props: any) => {
  return (
    <ErrorBoundary disableLogs={disableLogs}>
      <WrapperComponent {...props} />
    </ErrorBoundary>
  );
};
