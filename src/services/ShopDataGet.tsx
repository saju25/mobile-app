import axios from "@/axios/axios";
import { getToken } from "@/axios/Token";

export const shopDataGet = async () => {
    const token = await getToken() ;
       console.log(token)
    try {
        const response = await axios.get('/shop',
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in request header
                },
            }
        );
   
        if (!response.data || !response.data.shop) {
            return null; 
        }
        return response.data.shop; 
    } catch (error) {
        throw error; 
    }
};
