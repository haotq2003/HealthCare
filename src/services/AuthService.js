import axios from "axios";
import { API_URL } from "../config/apiURL";

export const AuthService = {
  login: async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/Authentication/login`, {
        email,
        password,
      });
      const { accessToken, userResponse } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('currentUser', JSON.stringify(userResponse));
      return {
        success: true,
        user: userResponse,
        token: accessToken,
        role: userResponse.role,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      // Validate dateOfBirth
      if (!formData.DateOfBirth || isNaN(new Date(formData.DateOfBirth).getTime())) {
        throw new Error('Ngày sinh không hợp lệ');
      }

      const requestBody = {
        FullName: formData.FullName,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber, 
        Password: formData.Password,
        ConfirmPassword: formData.ConfirmPassword,
        DateOfBirth: new Date(formData.DateOfBirth).toISOString(),
        Gender: formData.Gender,
        Role: formData.Role,
      };

      console.log('Sending to backend:', requestBody);

      const res = await axios.post(`${API_URL}/api/Authentication/register`, requestBody);

      return {
        success: true,
        message: res.data.message || 'Đăng ký thành công!',
      };
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      
      // Better error handling for validation errors
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        throw new Error(errorMessages[0] || "Đăng ký thất bại. Vui lòng thử lại.");
      }
      
      throw new Error(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  },

  changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Bạn chưa đăng nhập.');
      const res = await axios.post(
        `${API_URL}/api/Authentication/change-password`,
        { oldPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return {
        success: true,
        message: res.data.message || 'Đổi mật khẩu thành công!'
      };
    } catch (error) {
      let msg = error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại.';
      return {
        success: false,
        message: msg
      };
    }
  },

  // Lấy thông tin profile user bao gồm trạng thái cycle tracking
  getUserProfile: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Không có token xác thực');
      }

      const response = await fetch(`${API_URL}/api/Authentication/profile`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if (response.status === 401) {
        localStorage.removeItem('accessToken');
        throw new Error('Phiên đăng nhập hết hạn');
      } else {
        throw new Error('Không thể lấy thông tin profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};