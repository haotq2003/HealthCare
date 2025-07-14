import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import './UserProfilePage.scss';
import Swal from 'sweetalert2';
import axios from 'axios';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  const [formData, setFormData] = useState(profile);

  // Lấy thông tin user từ API khi load trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.get('https://localhost:7276/api/Authentication/profile', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const data = res.data.data;
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || ''
        });
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phoneNumber || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || ''
        });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Không thể tải thông tin hồ sơ từ server.', confirmButtonText: 'Đồng ý' });
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      // Chuẩn hóa dữ liệu gửi lên API
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth
      };
      await axios.put('https://localhost:7276/api/Authentication/profile', payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProfile(formData);
      setIsEditing(false);
      Swal.fire({ icon: 'success', title: 'Thành công!', text: 'Cập nhật thông tin thành công!', confirmButtonText: 'Đồng ý' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: error.response?.data?.message || 'Cập nhật thông tin thất bại.', confirmButtonText: 'Đồng ý' });
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  // State và logic đổi mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const errors = [];
    if (password.length < minLength) errors.push(`Ít nhất ${minLength} ký tự`);
    if (!hasUpperCase) errors.push('Có ít nhất 1 chữ hoa');
    if (!hasLowerCase) errors.push('Có ít nhất 1 chữ thường');
    if (!hasNumbers) errors.push('Có ít nhất 1 số');
    if (!hasSpecialChar) errors.push('Có ít nhất 1 ký tự đặc biệt');
    return errors;
  };

  const handlePasswordUpdate = async () => {
    try {
      if (!passwords.current) {
        Swal.fire({ icon: 'warning', title: 'Thiếu thông tin', text: 'Vui lòng nhập mật khẩu hiện tại!', confirmButtonText: 'Đồng ý' });
        return;
      }
      const passwordErrors = validatePassword(passwords.new);
      if (passwordErrors.length > 0) {
        Swal.fire({ 
          icon: 'warning', 
          title: 'Mật khẩu không đủ mạnh',
          html: `<b>Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</b>`,
          confirmButtonText: 'Đồng ý'
        });
        return;
      }
      if (passwords.new !== passwords.confirm) {
        Swal.fire({ icon: 'error', title: 'Lỗi xác nhận', text: 'Mật khẩu mới không khớp!', confirmButtonText: 'Đồng ý' });
        return;
      }
      if (passwords.current === passwords.new) {
        Swal.fire({ icon: 'warning', title: 'Mật khẩu không hợp lệ', text: 'Mật khẩu mới phải khác mật khẩu hiện tại!', confirmButtonText: 'Đồng ý' });
        return;
      }
      Swal.fire({ title: 'Đang cập nhật...', text: 'Vui lòng chờ trong giây lát', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
      // Gọi trực tiếp API đổi mật khẩu
      const accessToken = localStorage.getItem('accessToken');
      try {
        const res = await axios.post(
          `https://localhost:7276/api/Authentication/change-password`,
          {
            oldPassword: passwords.current,
            newPassword: passwords.new,
            confirmPassword: passwords.confirm
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        Swal.fire({ icon: 'success', title: 'Thành công!', text: res.data.message || 'Đổi mật khẩu thành công!', confirmButtonText: 'Đồng ý' });
        setPasswords({ current: '', new: '', confirm: '' });
      } catch (error) {
        let msg = error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại.';
        Swal.fire({ icon: 'error', title: 'Lỗi!', text: msg, confirmButtonText: 'Đồng ý' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại!', confirmButtonText: 'Đồng ý' });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderField = (label, value, field, type = 'text', icon = null) => (
    <div className="profile-field">
      <div className="field-label">
        {icon && <span className="field-icon">{icon}</span>}
        <span>{label}</span>
      </div>
      {isEditing ? (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="field-input"
        />
      ) : (
        <div className="field-value">{
          field === 'dateOfBirth' ? formatDate(value) : value
        }</div>
      )}
    </div>
  );

  const renderTextArea = (label, value, field, icon = null) => (
    <div className="profile-field">
      <div className="field-label">
        {icon && <span className="field-icon">{icon}</span>}
        <span>{label}</span>
      </div>
      {isEditing ? (
        <textarea
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="field-textarea"
          rows={3}
        />
      ) : (
        <div className="field-value">{value}</div>
      )}
    </div>
  );

  const renderSelect = (label, value, field, options, icon = null) => (
    <div className="profile-field">
      <div className="field-label">
        {icon && <span className="field-icon">{icon}</span>}
        <span>{label}</span>
      </div>
      {isEditing ? (
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="field-select"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="field-value">{value}</div>
      )}
    </div>
  );

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <div className="profile-info">
          <h1>{profile.fullName}</h1>
          <p>Thông tin cá nhân</p>
        </div>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn btn-save" onClick={handleSave}>
                <Save size={18} />
                Lưu
              </button>
              <button className="btn btn-cancel" onClick={handleCancel}>
                <X size={18} />
                Hủy
              </button>
            </>
          ) : (
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              <Edit size={18} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Thông tin cá nhân</h2>
          <div className="profile-grid">
            {renderField('Họ và tên', profile.fullName, 'fullName', 'text', <User size={16} />)}
            {renderField('Email', profile.email, 'email', 'email', <Mail size={16} />)}
            {renderField('Số điện thoại', profile.phone, 'phone', 'tel', <Phone size={16} />)}
            {renderField('Ngày sinh', profile.dateOfBirth, 'dateOfBirth', 'date', <Calendar size={16} />)}
            {renderSelect('Giới tính', profile.gender, 'gender', [
              { value: 'Nam', label: 'Nam' },
              { value: 'Nữ', label: 'Nữ' },
              { value: 'Khác', label: 'Khác' }
            ])}
          </div>
        </div>
        {/* Bảo mật - Đổi mật khẩu */}
        <div className="profile-section">
          <h2><Lock size={20} style={{marginRight:8}}/>Bảo mật</h2>
          <div className="password-section">
            <h3>Đổi mật khẩu</h3>
            <div className="password-form">
              <div className="password-field">
                <label>Mật khẩu hiện tại</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="password-field">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="password-input"
                />
                <small className="password-hint">
                  Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                </small>
              </div>
              <div className="password-field">
                <label>Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="password-input"
                />
              </div>
              <button onClick={handlePasswordUpdate} className="btn-update-password">
                Cập nhật mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 