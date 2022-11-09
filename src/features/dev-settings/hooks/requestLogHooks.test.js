import {renderHook} from '@testing-library/react-hooks';
import {useRequestLogger} from './requestLogHooks';
import {RequestLogger} from '@docknetwork/wallet-sdk-request-logger/lib/request-logger';
import RNFS from 'react-native-fs';
import * as utils from '../../accounts/account-slice';

describe('Request Logs', () => {
  it('expect to export log', async () => {
    const {result} = renderHook(() => useRequestLogger());

    jest.spyOn(utils, 'exportFile').mockImplementationOnce(async () => []);
    jest
      .spyOn(RequestLogger, 'exportLog')
      .mockImplementationOnce(async () => []);

    await result.current.exportLogRequest();

    expect(RequestLogger.exportLog).toBeCalled();
    expect(RNFS.writeFile).toBeCalled();
    expect(utils.exportFile).toBeCalled();
  });
  it('expect to clear logs', async () => {
    const {result} = renderHook(() => useRequestLogger());
    jest
      .spyOn(RequestLogger, 'clearLogs')
      .mockImplementationOnce(async () => undefined);

    await result.current.clearRequestLogs();

    expect(RequestLogger.clearLogs).toBeCalled();
  });
});
