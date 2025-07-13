import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
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

  if (!profile) return <p>Đang tải...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>
      <div>
        <strong>Họ tên:</strong> {profile.fullName}
      </div>
      <div>
        <strong>Email:</strong> {profile.email}
      </div>
      <div>
        <strong>SĐT:</strong> {profile.phoneNumber}
      </div>
      <div>
        <strong>Ngày sinh:</strong>{" "}
        {new Date(profile.dateOfBirth).toLocaleDateString()}
      </div>
      <div>
        <strong>Vai trò:</strong> {profile.role}
      </div>
      <div>
        <strong>Ngày tạo:</strong>{" "}
        {new Date(profile.createdTime).toLocaleString()}
      </div>
    </div>
  );
};

export default ProfilePage;
