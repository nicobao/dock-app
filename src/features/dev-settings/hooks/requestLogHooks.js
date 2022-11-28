import {useCallback, useMemo} from 'react';
import {RequestLogger} from '@docknetwork/wallet-sdk-request-logger/lib/request-logger';
import RNFS from 'react-native-fs';
import {exportFile} from '../../accounts/account-slice';
import {translate} from '../../../locales';
import {showToast, withErrorToast} from '../../../core/toast';

export function useRequestLogger() {
  const exportLogRequest = useCallback(async () => {
    const logs = RequestLogger.exportLog();

    const path = `${
      RNFS.DocumentDirectoryPath
    }/log-file-${new Date().getTime()}.json`;

    const mimeType = 'application/json';
    await RNFS.writeFile(path, JSON.stringify(logs));

    exportFile({
      path,
      mimeType,
      errorMessage: translate('dev_settings.export_error'),
    });
  }, []);
  const clearRequestLogs = useCallback(async () => {
    RequestLogger.clearLogs();
    showToast({
      message: translate('dev_settings.cleared_log_request_successfully'),
      type: 'success',
    });
  }, []);

  return useMemo(() => {
    return {
      exportLogRequest: withErrorToast(exportLogRequest),
      clearRequestLogs: withErrorToast(clearRequestLogs),
    };
  }, [clearRequestLogs, exportLogRequest]);
}
