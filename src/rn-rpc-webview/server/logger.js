
export default {
  name: "logger",
  routes: [
    async function log(...params) {
      console.log('====> Webview logger:');
      console.log(...params);
      
      return 'okkkk'
    },
  ],
};
