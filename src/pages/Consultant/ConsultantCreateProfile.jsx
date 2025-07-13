import React, { useState } from 'react';
import { ConsultantService } from '../../services/ConsultantService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ConsultantCreateProfile = () => {
  const { user } = useAuth(); // chứa user.id
  const navigate = useNavigate();
  const [form, setForm] = useState({
    degree: '',
    experience: 0,
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
         console.log("Dữ liệu gửi đi:", form); 
      await ConsultantService.createProfile(user.id, form);
      toast.success('Tạo hồ sơ thành công');
      navigate('/consultant/dashboard');
    } catch (error) {
      toast.error('Lỗi khi tạo hồ sơ');
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tạo hồ sơ tư vấn viên</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Bằng cấp</label>
          <input
            name="degree"
            value={form.degree}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Kinh nghiệm (năm)</label>
          <input
            name="experience"
            type="number"
            value={form.experience}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Giới thiệu</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lưu hồ sơ
        </button>
      </form>
    </div>
  );
};

export default ConsultantCreateProfile;
