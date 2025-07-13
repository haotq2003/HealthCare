// src/pages/admin/UserPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import styles from "./UserPage.module.scss";

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
    <div className={styles.container}>
      <h1 className={styles.heading}>Quản lý người dùng</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Ngày sinh</th>
              <th>Vai trò</th>
              <th className={styles.textCenter}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                <td>
                  <select
                    value={
                      roleOptions.find((r) => r.label === user.role)?.value ?? 1
                    }
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={styles.roleSelect}
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={styles.textCenter}>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className={styles.deleteBtn}
                    title="Xoá người dùng"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          disabled={pageIndex === 1}
        >
          ← Trước
        </button>
        <span>
          Trang {pageIndex} / {totalPages}
        </span>
        <button
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
          disabled={pageIndex === totalPages}
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
};

export default UserPage;
