import axios from 'axios';

const instance = axios.create({});
instance.interceptors.request.use(function (config) {
  return config;
});
instance.interceptors.response.use(function (response) {
  return response;
});

export default instance;
