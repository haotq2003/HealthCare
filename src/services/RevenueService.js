import axios from "axios"
import { API_URL } from "../config/apiURL"

export const RevenueService = {
    getRevenue : async () =>{
        try {
            const res = await axios.get(`${API_URL}/api/Statistics/statistics/revenue`,{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            return res.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
