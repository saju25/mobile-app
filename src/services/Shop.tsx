import axios from "@/axios/axios";
import { getToken } from "@/axios/Token";

export const shopDataGet = async () => {

    try {
        const token = await getToken() ;
       
        if (!token) {
            throw new Error('No token found'); 
        }

        const response = await axios.get('/shop-approved');
   
        if (!response.data || !response.data.shop) {
            return null; 
        }

        return response.data.shop; 
    } catch (error) {
        throw error; 
    }
};
