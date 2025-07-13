import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.scss"; // SCSS module

const AdminLayout = () => {
  return (
    <div className={styles["admin-layout"]}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
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
            Users
          </NavLink>
          {/* <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              isActive ? `${styles.link} active` : styles.link
            }
          >
            Bookings
          </NavLink> */}
          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              isActive ? `${styles.link} active` : styles.link
            }
          >
            Profile
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles["main-content"]}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
