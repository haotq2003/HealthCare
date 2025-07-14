import { API_URL } from '../config/apiURL';
import { AuthService } from './AuthService';

export const CycleTrackingService = {
  // Bật/tắt cycle tracking - duy nhất 1 API
  updateCycleTracking: async (isEnabled) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Không có token xác thực');
      }

      const response = await fetch(`${API_URL}/api/CycleTracking/enable-tracking?isEnabled=${isEnabled}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra khi cập nhật cycle tracking');
      }
    } catch (error) {
      console.error('Error updating cycle tracking:', error);
      throw error;
    }
  },

  // Lấy danh sách cycle tracking (API có sẵn)
  getCycleHistory: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Không có token xác thực');
      }

      const response = await fetch(`${API_URL}/api/CycleTracking`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      } else if (response.status === 401) {
        localStorage.removeItem('accessToken');
        throw new Error('Phiên đăng nhập hết hạn');
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching cycle history:', error);
      throw error;
    }
  },

  // Tạo cycle tracking mới (API có sẵn)
  createCycleTracking: async (cycleData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Không có token xác thực');
      }

      // Kiểm tra trạng thái cycle tracking trước khi tạo
      const userProfile = await AuthService.getUserProfile();
      console.log('User profile for cycle tracking check:', userProfile);
      if (!userProfile.isCycleTrackingOn) {
        throw new Error('Tính năng theo dõi chu kỳ đang tắt. Vui lòng bật trong cài đặt!');
      }

      // Validate required fields
      if (!cycleData.startDate) {
        throw new Error('Ngày bắt đầu chu kỳ là bắt buộc');
      }
      if (!cycleData.cycleLength || cycleData.cycleLength <= 20 || cycleData.cycleLength > 35) {
        throw new Error('Độ dài chu kỳ phải lớn hơn 20 và nhỏ hơn hoặc bằng 35 ngày');
      }
      if (!cycleData.periodLength || cycleData.periodLength <= 1 || cycleData.periodLength > 10) {
        throw new Error('Số ngày kinh nguyệt phải lớn hơn 1 và nhỏ hơn hoặc bằng 10 ngày');
      }

      // Convert date to ISO string format
      const startDateISO = new Date(cycleData.startDate + 'T00:00:00').toISOString();

      const requestBody = {
        startDate: startDateISO,
        cycleLength: parseInt(cycleData.cycleLength),
        periodLength: parseInt(cycleData.periodLength),
        notes: cycleData.notes || ''
      };

      console.log('Sending cycle tracking data:', requestBody);

      const response = await fetch(`${API_URL}/api/CycleTracking`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Success response:', result);
        return result.data;
      } else if (response.status === 401) {
        localStorage.removeItem('accessToken');
        throw new Error('Phiên đăng nhập hết hạn');
      } else {
        let errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating cycle tracking:', error);
      throw error;
    }
  }
}; 