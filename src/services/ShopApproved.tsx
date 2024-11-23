import axios from "@/axios/axios";
import { getToken } from "@/axios/Token";

export const ShopApprovedGet = async () => {

    try {
        const token = await getToken() ;
       
      // Adjust this if you store token elsewhere
        if (!token) {
            throw new Error('No token found'); // Throw an error if token is missing
        }

        const response = await axios.get('/shop-approved', {
            headers: {
                Authorization: `Bearer ${token}`, // Include token in request header
            },
        });
   
        if (!response.data || !response.data.shop) {
            return null; // Return null if no shop data
        }

        return response.data.shop; // Return the shop data
    } catch (error) {
        throw error; // Rethrow the error to be handled by the caller
    }
};
