import axios from "axios";
import { API_URL } from "../config/apiURL";


export const SlotService ={

    getSlotByConsultantId: async (consultantId) => {
        try {
          const res = await axios.get(`${API_URL}/api/Slot/getSlotByConsultantId/${consultantId}`);
          return res.data;
        } catch (error) {
          console.error('Lỗi khi lấy lịch làm việc:', error);
          throw error;
        }
      },
      getSlotByDateAndConsultant: async (consultantId, date) => {
  try {
    const res = await axios.get(`${API_URL}/api/AvailableSlots/slots`, {
      params: {
        ConsultantId: consultantId,
        Date: date,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy slot:", error);
    throw error;
  }
},

}