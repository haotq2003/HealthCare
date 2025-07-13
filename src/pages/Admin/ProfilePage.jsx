import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://localhost:7276/api/Authentication/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cá nhân:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return (
      <p className="text-center mt-10 text-gray-600">Đang tải thông tin...</p>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Thông tin cá nhân
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Họ tên
            </span>
            <p className="text-lg font-semibold">{profile.fullName}</p>
          </div>
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Email
            </span>
            <p className="text-lg font-semibold">{profile.email}</p>
          </div>
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Số điện thoại
            </span>
            <p className="text-lg font-semibold">{profile.phoneNumber}</p>
          </div>
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Ngày sinh
            </span>
            <p className="text-lg font-semibold">
              {new Date(profile.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Vai trò
            </span>
            <p className="text-lg font-semibold">{profile.role}</p>
          </div>
          <div>
            <span className="block font-medium text-sm text-gray-500">
              Ngày tạo
            </span>
            <p className="text-lg font-semibold">
              {new Date(profile.createdTime).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
