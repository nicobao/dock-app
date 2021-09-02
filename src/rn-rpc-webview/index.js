import React, {useRef} from 'react';
import WebView from 'react-native-webview';
import {
  getRpcClient,
  initRpcClient,
} from '@docknetwork/react-native-sdk/src/rpc-client';
import rpcServer from './server';
import {Platform} from 'react-native';
import {showToast} from 'src/core/toast';
import {useDispatch} from 'react-redux';
import {appActions} from 'src/features/app/app-slice';

const WEBVIEW_URI = 'http://localhost:3000';
const DEV_MODE = false;

export function RNRpcWebView({onReady}) {
  const webViewRef = useRef();
  const dispatch = useDispatch();
  const baseUrl =
    Platform.OS === 'ios' ? 'app-html' : 'file:///android_asset/app-html';

  return (
    <WebView
      style={{display: 'none'}}
      ref={webViewRef}
      originWhitelist={['*']}
      source={
        DEV_MODE
          ? {
              uri: WEBVIEW_URI,
            }
          : {
              uri: `${baseUrl}/index.html`,
              baseUrl: baseUrl,
            }
      }
      onError={() => {
        dispatch(
          appActions.setRpcReady(
            new Error('Unable to initialize the wallet sdk'),
          ),
        );
      }}
      onMessage={async event => {
        const data = JSON.parse(event.nativeEvent.data);

        console.log('onMessage', data);
        if (data.type === 'json-rpc-ready') {
          if (DEV_MODE) {
            showToast({
              message: 'RPC client connected',
            });
          }
          initRpcClient(async jsonRPCRequest => {
            console.log('Send request to webview client', jsonRPCRequest);

            webViewRef.current.injectJavaScript(`
            (function(){
              (navigator.appVersion.includes("Android") ? document : window).dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
                {
                  type: 'json-rpc-request',
                  body: jsonRPCRequest,
                },
              )}}));
            })();
        
            `);

            return jsonRPCRequest;
          });

          if (onReady) {
            onReady();
          }
        } else if (data.type === 'json-rpc-response') {
          getRpcClient().receive(data.body);
        } else if (data.type === 'json-rpc-request') {
          rpcServer.receive(data.body).then(response => {
            console.log(
              'RN: Send json-rpc-request to webview client',
              response,
            );
            webViewRef.current.injectJavaScript(`
            (function(){
              (navigator.appVersion.includes("Android") ? document : window).dispatchEvent(new MessageEvent('message', {data: ${JSON.stringify(
                {
                  type: 'json-rpc-response',
                  body: response,
                },
              )}}));
            })();
            `);

            return response;
          });
        } else if (data.type === 'log') {
          console.log('====> Webview log:');
          console.log(...JSON.parse(data.body));
        }
      }}
    />
  );
}
