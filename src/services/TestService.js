import axios from "axios";
import { API_URL } from "../config/apiURL";

export const TestService = {
  getTestBookings: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.get(`${API_URL}/api/TestBookings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
        },
      });
      return res.data.data.items; // Trả về đúng mảng bookings
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đăng ký xét nghiệm:', error);
      throw error;
    }
  },
  getResultUrlByCustomerId: async (customerId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await axios.get(`${API_URL}/api/TestBookings/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': '*/*',
        },
      });
      return res.data.resultUrl;
    } catch (error) {
      console.error('Lỗi khi lấy resultUrl:', error);
      throw error;
    }
  },
}; 