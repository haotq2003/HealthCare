import axios from "axios";
import { API_URL } from "../config/apiURL";

export const ConsultantService = {
    getConsultantList: async (page = 1 ,size = 10) => {
        try {
            const res = await axios.get(`${API_URL}/api/Consultants?page=${page}&size=${size}`);
            return res.data.data;
        } catch (error) {
            console.error("Error fetching consultant list:", error);
            throw error;
        }
    },
    getConsultantDetail: async (id) => {
        try {
            const res = await axios.get(`${API_URL}/api/Consultants/${id}`);
            return res.data.data;
        } catch (error) {
            console.error("Error fetching consultant detail:", error);
            throw error;
        }
    },
    updateConsultant: async (id, formData) => {
        try {
            const res = await axios.put(`${API_URL}/api/Consultants/${id}`, formData);
            return res.data.data;
        } catch (error) {
            console.error("Error updating consultant:", error);
            throw error;
        }
    },
    createConsultation: async (slotId, reason) => {
        try {
            const res = await axios.post(`${API_URL}/api/Consultation`, {
                slotId,
                reason,
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            return res.data.data;
        } catch (error) {
            console.error("Error creating consultation:", error);
            throw error;
        }
    },
    getConsultantByUserId: async () => {
        try {
            const res = await axios.get(`${API_URL}/api/Consultation/consultations`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            return res.data.data;
        } catch (error) {
            console.error("Error fetching consultant detail:", error);
            throw error;
        }
    },
  confirmConsultation: async (consultationId) => {
  try {
    const res = await axios.put(
      `${API_URL}/api/Consultation/${consultationId}/confirm`,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error confirming consultation:", error);
    throw error;
  }
},

    resultConsultation : async (consultationId,result) =>{
        try {
            const res = await axios.put(`${API_URL}/api/Consultation/${consultationId}/result`,
            {
                result,
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            return res.data.data;
        } catch (error) {
            console.error("Error result consultation:", error);
            throw error;
        }
    },
    getConsultantByStatus: async (status) => {
        try {
            const res = await axios.get(`${API_URL}/api/Consultation/consultations?Status=${status}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            return res.data.data;
        } catch (error) {
            console.error("Error fetching consultant detail:", error);
            throw error;
        }
    },
    
}