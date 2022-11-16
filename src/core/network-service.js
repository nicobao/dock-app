import axios from 'axios';
import {RequestLogger} from '@docknetwork/wallet-sdk-request-logger/lib/request-logger';
const instance = axios.create({});
import store from '../core/redux-store';
instance.interceptors.response.use(
  function (response) {
    const {url, method, headers, data} = response.config;
    const {status, data: payload} = response;

    const shouldLogRequest =
      store.getState()?.app?.features?.shouldLogRequest || false;
    if (shouldLogRequest) {
      RequestLogger.logRequest({
        url,
        method,
        headers,
        body: data,
        response: payload,
        status,
      });
    }
    return response;
  },
  function (error) {
    const shouldLogRequest =
      store.getState()?.app?.features?.shouldLogRequest || false;
    const response = error.response;
    const {status, data: payload} = response;

    const {url, method, headers, data} = response.config;
    if (shouldLogRequest) {
      RequestLogger.logRequest({
        url,
        method,
        headers,
        body: data,
        response: payload,
        status,
      });
    }
    return Promise.reject(error);
  },
);

export default instance;
