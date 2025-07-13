import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const token = localStorage.getItem("accessToken");

  const roleOptions = [
    { value: 1, label: "Customer" },
    { value: 2, label: "Consultant" },
    { value: 3, label: "Staff" },
    { value: 4, label: "Manager" },
  ];

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7276/api/Admin/users?PageIndex=${pageIndex}&PageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data.data.items);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        toast.error("Lỗi khi tải danh sách người dùng");
      }
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;

    try {
      await axios.delete(`https://localhost:7276/api/Admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Đã xoá người dùng");
      fetchUsers();
    } catch (error) {
      toast.error("Không thể xoá người dùng");
      console.error(error);
    }
  };

  const handleRoleChange = async (id, newRoleValue) => {
    const parsedValue = parseInt(newRoleValue);
    try {
      await axios.put(
        `https://localhost:7276/api/Admin/${id}/update-role`,
        { newRole: parsedValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Đã cập nhật vai trò");

      // Cập nhật lại state users
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                role: roleOptions.find((r) => r.value === parsedValue)?.label,
              }
            : user
        )
      );
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-800">Quản lý người dùng</h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-800 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Họ tên</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">SĐT</th>
              <th className="px-6 py-3">Ngày sinh</th>
              <th className="px-6 py-3">Vai trò</th>
              <th className="px-6 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">{user.fullName}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.phoneNumber}</td>
                <td className="px-6 py-3">
                  {new Date(user.dateOfBirth).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                    value={
                      roleOptions.find((r) => r.label === user.role)?.value ?? 1
                    }
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800 hover:underline font-medium"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          disabled={pageIndex === 1}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          ← Trước
        </button>
        <span className="text-gray-700 font-medium">
          Trang {pageIndex} / {totalPages}
        </span>
        <button
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageIndex === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
};

export default UserPage;
