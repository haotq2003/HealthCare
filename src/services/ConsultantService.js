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
}