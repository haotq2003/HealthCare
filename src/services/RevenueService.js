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
    },
 exportReport: async (format = 'csv') => {
  try {
    const res = await axios.get(`${API_URL}/api/Report/transactions/export`, {
      params: {
       
        format,
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      responseType: 'blob' 
    });

    const blob = new Blob([res.data], {
      type: format === 'csv'
        ? 'text/csv;charset=utf-8;'
        : 'application/pdf'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report.${format}`); 
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error(error?.response?.data || error.message);
    throw error;
  }
},
getAllReport : async () =>{
    try {
        const res = await axios.get(`${API_URL}/api/Report`,{
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        return res.data
    } catch (error) {
      console.error(error?.response?.data || error.message);
        throw error
    }
}

}
