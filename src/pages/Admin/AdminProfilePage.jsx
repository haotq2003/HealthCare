import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "https://localhost:7276/api/Authentication/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(res.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cá nhân:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Đã lưu thông tin:", profile);
    // Gọi API lưu nếu cần
  };

  if (!profile)
    return <p className="text-center mt-10 text-gray-600">Đang tải...</p>;

  const tabs = [
    { id: "personal", name: "Thông tin cá nhân" },
    { id: "settings", name: "Cài đặt" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hồ sơ Quản trị viên
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản quản trị của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-blue-600">
                  {profile.fullName.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold mt-4">
                  {profile.fullName}
                </h3>
                <p className="text-gray-600">{profile.role}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border">
              {activeTab === "personal" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Thông tin cá nhân
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {isEditing ? "Hủy" : "Chỉnh sửa"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Họ tên
                      </label>
                      <input
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Số điện thoại
                      </label>
                      <input
                        name="phoneNumber"
                        value={profile.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Ngày sinh
                      </label>
                      <input
                        name="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth?.substring(0, 10)}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Vai trò
                      </label>
                      <input
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">
                        Ngày tạo
                      </label>
                      <input
                        value={new Date(profile.createdTime).toLocaleString()}
                        disabled
                        className="w-full px-4 py-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Cài đặt tài khoản
                  </h2>
                  <div className="space-y-6">
                    <div className="border p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">
                        Thay đổi mật khẩu
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Cập nhật mật khẩu để bảo mật hơn
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Đổi mật khẩu
                      </button>
                    </div>
                    <div className="border p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">
                        Xóa tài khoản
                      </h3>
                      <p className="text-red-600 mb-4">
                        Xóa vĩnh viễn tài khoản và dữ liệu
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
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

export default AdminProfilePage;
