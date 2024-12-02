import axios from "@/axios/axios";
import { getToken } from "@/axios/Token";

export const productGet = async () => {
    try {
        // Get the token from the helper function
        const token = await getToken();
        
        // If no token is returned, handle the case accordingly
        if (!token) {
            throw new Error('No token found');
        }

        // Make the GET request to fetch cart data
        const response = await axios.get('/product', {
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request header
            },
        });
        return response.data // Return the actual cart data

    } catch (error) {
        console.error('Error fetching cart data:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
};
