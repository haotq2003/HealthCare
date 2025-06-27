import React, { useState } from 'react';
import ConsultantLayout from '../../components/Consultant/ConsultantLayout';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Nguyễn',
    lastName: 'Văn An',
    email: 'nguyenvanan@healthcare.com',
    phone: '0123456789',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    bio: 'Bác sĩ chuyên khoa Sản phụ khoa với hơn 10 năm kinh nghiệm trong lĩnh vực tư vấn sức khỏe sinh sản và điều trị các bệnh lý phụ khoa.',
    specialization: 'Sản phụ khoa',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    consultationFee: 500000
  });

  const [qualifications, setQualifications] = useState([
    {
      id: 1,
      type: 'degree',
      title: 'Bằng Tiến sĩ Y khoa',
      institution: 'Đại học Y Dược TP.HCM',
      year: '2010',
      verified: true,
      document: 'degree_2010.pdf'
    },
    {
      id: 2,
      type: 'certificate',
      title: 'Chứng chỉ Tư vấn Sức khỏe Sinh sản',
      institution: 'Bộ Y tế',
      year: '2015',
      verified: true,
      document: 'certificate_2015.pdf'
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Chứng chỉ Điều trị STI',
      institution: 'WHO Vietnam',
      year: '2018',
      verified: false,
      document: 'certificate_2018.pdf'
    }
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      position: 'Bác sĩ Trưởng khoa Sản',
      hospital: 'Bệnh viện Từ Dũ',
      startDate: '2015-01-01',
      endDate: '2020-12-31',
      description: 'Phụ trách khoa Sản, tư vấn và điều trị cho hơn 1000 ca sinh nở mỗi năm.',
      current: false
    },
    {
      id: 2,
      position: 'Tư vấn viên Sức khỏe Sinh sản',
      hospital: 'HealthCare+ Platform',
      startDate: '2021-01-01',
      endDate: null,
      description: 'Tư vấn trực tuyến về sức khỏe sinh sản, kế hoạch hóa gia đình và điều trị STI.',
      current: true
    }
  ]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePersonalInfo = () => {
    setIsEditing(false);
    console.log('Saving personal info:', personalInfo);
  };

  const handleAddQualification = () => {
    const newQualification = {
      id: Date.now(),
      type: 'certificate',
      title: '',
      institution: '',
      year: '',
      verified: false,
      document: null
    };
    setQualifications([...qualifications, newQualification]);
  };

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      position: '',
      hospital: '',
      startDate: '',
      endDate: null,
      description: '',
      current: false
    };
    setExperiences([...experiences, newExperience]);
  };

  const tabs = [
    { id: 'personal', name: 'Thông tin cá nhân', icon: 'user' },
    { id: 'qualifications', name: 'Bằng cấp & Chứng chỉ', icon: 'academic-cap' },
    { id: 'experience', name: 'Kinh nghiệm', icon: 'briefcase' },
    { id: 'settings', name: 'Cài đặt', icon: 'cog' }
  ];

  const renderIcon = (iconName) => {
    const icons = {
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      'academic-cap': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      briefcase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V8" />
        </svg>
      ),
      cog: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    };
    return icons[iconName];
  };

  return (
    
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân, bằng cấp và kinh nghiệm của bạn</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h3>
                  <p className="text-gray-600">{personalInfo.specialization}</p>
                  <div className="flex items-center justify-center mt-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">4.8 (89 đánh giá)</span>
                  </div>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {renderIcon(tab.icon)}
                      <span className="ml-3">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                        <input
                          type="text"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={personalInfo.dateOfBirth}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                        <select
                          name="gender"
                          value={personalInfo.gender}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên khoa</label>
                        <input
                          type="text"
                          name="specialization"
                          value={personalInfo.specialization}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phí tư vấn (VNĐ)</label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={personalInfo.consultationFee}
                          onChange={handlePersonalInfoChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={personalInfo.address}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giới thiệu bản thân</label>
                      <textarea
                        name="bio"
                        value={personalInfo.bio}
                        onChange={handlePersonalInfoChange}
                        disabled={!isEditing}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>

                    {isEditing && (
                      <div className="mt-6 flex justify-end space-x-4">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={handleSavePersonalInfo}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Lưu thay đổi
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Qualifications Tab */}
                {activeTab === 'qualifications' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Bằng cấp & Chứng chỉ</h2>
                      <button
                        onClick={handleAddQualification}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Thêm mới
                      </button>
                    </div>

                    <div className="space-y-4">
                      {qualifications.map((qual) => (
                        <div key={qual.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{qual.title}</h3>
                                {qual.verified && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Đã xác minh
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-1">{qual.institution}</p>
                              <p className="text-sm text-gray-500">Năm: {qual.year}</p>
                              {qual.document && (
                                <div className="mt-2">
                                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                                    📄 {qual.document}
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h2>
                      <button
                        onClick={handleAddExperience}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Thêm kinh nghiệm
                      </button>
                    </div>

                    <div className="space-y-6">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                                {exp.current && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Hiện tại
                                  </span>
                                )}
                              </div>
                              <p className="text-blue-600 font-medium mb-2">{exp.hospital}</p>
                              <p className="text-sm text-gray-500 mb-3">
                                {new Date(exp.startDate).toLocaleDateString('vi-VN')} - {
                                  exp.endDate ? new Date(exp.endDate).toLocaleDateString('vi-VN') : 'Hiện tại'
                                }
                              </p>
                              <p className="text-gray-700">{exp.description}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Cài đặt tài khoản</h2>
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Thay đổi mật khẩu</h3>
                        <p className="text-gray-600 mb-4">Cập nhật mật khẩu để bảo mật tài khoản</p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                          Đổi mật khẩu
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Thông báo</h3>
                        <p className="text-gray-600 mb-4">Quản lý cách bạn nhận thông báo</p>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200">
                          Cài đặt thông báo
                        </button>
                      </div>

                      <div className="border border-red-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-red-900 mb-2">Xóa tài khoản</h3>
                        <p className="text-red-600 mb-4">Xóa vĩnh viễn tài khoản và tất cả dữ liệu</p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                          Xóa tài khoản
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default ProfilePage;