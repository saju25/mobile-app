import axios from "@/axios/axios";

export const getUserData = async () => {
    try {
        const response = await axios.get('/user'); // Fetch user data from API

        if (!response.data || !response.data.user) { 
            // Check if the response has no user data
            console.warn('No user data found on the server');
            return null; // Explicitly return null to indicate no data
        }

        return response.data; // Return the data if it exists
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
};
