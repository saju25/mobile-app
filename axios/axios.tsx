// src/services/api.js
import axiosLib from 'axios';
import { deleteToken, getToken } from './Token';  
const axios = axiosLib.create({
    baseURL: 'http://192.168.31.43:8080/api', 
    headers: {
        Accept: 'application/json', 
       
    },
});

axios.interceptors.request.use(
    async (config) => {
        const token = await getToken(); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); 
    }
);


axios.interceptors.response.use(
    (response) => response, 
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, logging out...');
            await deleteToken();  
        }
        return Promise.reject(error);  
    }
);

export default axios;
