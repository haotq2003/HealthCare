import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `https://localhost:7276/api/Admin/users?PageIndex=${pageIndex}&PageSize=${pageSize}`
      );
      setUsers(res.data.data.items);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá người dùng này?")) return;
    try {
      await axios.delete(`https://localhost:7276/api/Admin/${id}`);
      toast.success("Đã xoá người dùng");
      fetchUsers();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Không thể xoá người dùng");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`https://localhost:7276/api/Admin/${id}/update-role`, {
        newRole: parseInt(newRole),
      });
      toast.success("Đã cập nhật vai trò");
      fetchUsers();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageIndex]);

  const roleOptions = [
    { value: 0, label: "Customer" },
    { value: 1, label: "Consultant" },
    { value: 2, label: "Admin" },
  ];

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
                      roleOptions.find((r) => r.label === user.role)?.value
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
