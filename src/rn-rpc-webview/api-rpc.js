import {rpcRequest} from './rpc-client';

export class ApiRpc {
  static getAccountBalance(...address) {
    return rpcRequest('api.getAccountBalance', ...address);
  }
}
