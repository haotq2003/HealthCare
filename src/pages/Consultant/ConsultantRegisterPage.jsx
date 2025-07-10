import React, { useState } from 'react';
import axios from 'axios';
import AuthLayout from '../../components/Auth/AuthLayout';
import { Link } from 'react-router-dom';

const ConsultantRegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    role: '',
    isCycleTrackingOn: false,
    degree: '',
    experienceYears: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Họ tên là bắt buộc';
    if (!form.email) newErrors.email = 'Email là bắt buộc';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
    if (!form.gender) newErrors.gender = 'Giới tính là bắt buộc';
    if (!form.password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!form.role) newErrors.role = 'Vai trò là bắt buộc';
    if (!form.degree) newErrors.degree = 'Bằng cấp là bắt buộc';
    if (form.experienceYears === '' || isNaN(form.experienceYears)) newErrors.experienceYears = 'Số năm kinh nghiệm là bắt buộc';
    if (!form.bio) newErrors.bio = 'Giới thiệu bản thân là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setMessage('');
    try {
      await axios.post('https://localhost:7276/api/Consultants', {
        ...form,
        experienceYears: Number(form.experienceYears),
      });
      setMessage('Đăng ký thành công!');
      setForm({
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        password: '',
        role: '',
        isCycleTrackingOn: false,
        degree: '',
        experienceYears: '',
        bio: '',
      });
      setErrors({});
    } catch (err) {
      setMessage(err.response?.data?.message || 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Đăng ký Tư vấn viên" subtitle="Tham gia đội ngũ tư vấn viên của HealthCare+">
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className={`p-3 rounded text-center ${message.includes('thành công') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên <span className="text-red-500">*</span></label>
          <input name="fullName" value={form.fullName} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập họ tên" />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập email" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập số điện thoại" />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh <span className="text-red-500">*</span></label>
          <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính <span className="text-red-500">*</span></label>
          <select name="gender" value={form.gender} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} >
            <option value="">Chọn</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu <span className="text-red-500">*</span></label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập mật khẩu" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò <span className="text-red-500">*</span></label>
          <input name="role" value={form.role} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Consultant" />
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>
        <div className="flex items-center">
          <input name="isCycleTrackingOn" type="checkbox" checked={form.isCycleTrackingOn} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label className="ml-2 block text-sm text-gray-700">Bật theo dõi chu kỳ?</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bằng cấp <span className="text-red-500">*</span></label>
          <input name="degree" value={form.degree} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.degree ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập bằng cấp" />
          {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số năm kinh nghiệm <span className="text-red-500">*</span></label>
          <input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.experienceYears ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Nhập số năm kinh nghiệm" />
          {errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân <span className="text-red-500">*</span></label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${errors.bio ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} placeholder="Giới thiệu về bạn" />
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-200 disabled:opacity-60">
          {loading ? 'Đang gửi...' : 'Đăng ký'}
        </button>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Đã có tài khoản? Đăng nhập</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ConsultantRegisterPage; 