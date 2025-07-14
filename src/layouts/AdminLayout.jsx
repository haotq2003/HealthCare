import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.scss"; // SCSS module
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles["admin-layout"]}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <div className={styles.title}>Admin Panel</div>
          <nav>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.link} active` : styles.link
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? `${styles.link} active` : styles.link
              }
            >
              Người dùng
            </NavLink>
            <NavLink
              to="/admin/accept-doctor"
              className={({ isActive }) =>
                isActive ? `${styles.link} active` : styles.link
              }
            >
              Tư vấn viên
            </NavLink>
            <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                isActive ? `${styles.link} active` : styles.link
              }
            >
              Hồ sơ
            </NavLink>
            <NavLink
              to="/admin/report-history"
              className={({ isActive }) =>
                isActive ? `${styles.link} active` : styles.link
              }
            >
              Lịch sử xuất file
            </NavLink>
          </nav>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      {/* Main Content */}
      <div className={styles["main-content"]}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
