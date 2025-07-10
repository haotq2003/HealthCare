import axios from "axios";
import { API_URL } from "../config/apiURL";

export const FeedbackService = {
    createFeedback: async (feedback) => {
        try {
            const res = await axios.post(`${API_URL}/api/Feedbacks`, feedback);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }
}