import {JSONRPCServer} from 'json-rpc-2.0';
import {createRpcService} from '@docknetwork/react-native-sdk/src/rpc-util';
import storageService from './async-storage-service';

const rpcServer = new JSONRPCServer();

[storageService].forEach(service => {
  const rpcService = createRpcService(service);

  rpcService.forEach(method => {
    rpcServer.addMethod(method.name, params => {
      return method.resolver(params);
    });
  });
});

export default rpcServer;
