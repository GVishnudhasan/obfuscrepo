import axios from 'axios';

export const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
  baseURL: REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
