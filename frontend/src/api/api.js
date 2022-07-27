import 'localstorage-polyfill';
import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token');
};

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.100:5050/api/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    const auth = token ? `Bearer ${token}` : '';

    config.headers.common['Content-Type'] = 'application/json';
    config.headers.common['Authorization'] = auth;
    return config;
  },
  (error) => Promise.reject(error)
)

export default axiosInstance;