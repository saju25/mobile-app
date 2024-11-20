import * as SecureStore from "expo-secure-store";

export const setToken = async (token) => {
    try {
        await SecureStore.setItemAsync('auth_token', token);  // Store token
        console.log('Token stored:', token);
    } catch (e) {
        console.error('Error storing token', e);
    }
};

export const getToken = async () => {
    try {
        const token = await SecureStore.getItemAsync('auth_token');  // Retrieve token
        console.log('Token retrieved:', token);
        return token;
    } catch (e) {
        console.error('Error retrieving token', e);
        return null;
    }
};

export const deleteToken = async () => {
    try {
        await SecureStore.deleteItemAsync('auth_token');  // Remove token on logout
        console.log('Token deleted');
    } catch (e) {
        console.error('Error removing token', e);
    }
};
