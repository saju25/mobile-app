// src/services/api.js
import axiosLib from 'axios';
import { deleteToken, getToken } from './Token';  // Import token management functions

const axios = axiosLib.create({
    baseURL: 'http://192.168.31.43:8080/api',  // Base URL for your Laravel API
    headers: {
        Accept: 'application/json',  // Default header to accept JSON responses
    },
});

// Add a request interceptor to attach the token in the Authorization header
axios.interceptors.request.use(
    async (config) => {
        const token = await getToken();  // Retrieve token from SecureStore
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // Attach token to the request
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);  // Reject on error
    }
);

// Add a response interceptor to handle token expiration (401 Unauthorized)
axios.interceptors.response.use(
    (response) => response,  // Return successful response as is
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, logging out...');
            await deleteToken();  // Clear token if expired or invalid
            // Optionally, redirect the user to the login screen:
            // router.push('/login'); // Add your navigation handling here
        }
        return Promise.reject(error);  // Reject the error
    }
);

export default axios;
