import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import './UserProfilePage.scss';

const UserProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    dateOfBirth: '1990-01-01',
    gender: 'Nam',
    emergencyContact: '0987654321',
    bloodType: 'A+',
    allergies: 'Không có',
    medicalHistory: 'Không có bệnh lý đặc biệt'
  });

  const [formData, setFormData] = useState(profile);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
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
        <div className="field-value">{value}</div>
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
          <h2>Thông tin cơ bản</h2>
          <div className="profile-grid">
            {renderField('Họ và tên', profile.fullName, 'fullName', 'text', <User size={16} />)}
            {renderField('Email', profile.email, 'email', 'email', <Mail size={16} />)}
            {renderField('Số điện thoại', profile.phone, 'phone', 'tel', <Phone size={16} />)}
            {renderField('Địa chỉ', profile.address, 'address', 'text', <MapPin size={16} />)}
            {renderField('Ngày sinh', profile.dateOfBirth, 'dateOfBirth', 'date', <Calendar size={16} />)}
            {renderSelect('Giới tính', profile.gender, 'gender', [
              { value: 'Nam', label: 'Nam' },
              { value: 'Nữ', label: 'Nữ' },
              { value: 'Khác', label: 'Khác' }
            ])}
          </div>
        </div>

        <div className="profile-section">
          <h2>Thông tin y tế</h2>
          <div className="profile-grid">
            {renderField('Liên hệ khẩn cấp', profile.emergencyContact, 'emergencyContact', 'tel', <Phone size={16} />)}
            {renderSelect('Nhóm máu', profile.bloodType, 'bloodType', [
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' }
            ])}
            {renderTextArea('Dị ứng', profile.allergies, 'allergies')}
            {renderTextArea('Tiền sử bệnh', profile.medicalHistory, 'medicalHistory')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 