import React from "react";
import { NavLink } from "react-router-dom";
import "./UserSidebar.scss";
import { Home, CalendarCheck, TestTube, HelpCircle, Heart } from 'lucide-react';

const UserSidebar = () => (
  <aside className="user-sidebar">
    <div className="sidebar-header">
      <h2>
        <div className="logo-icon">
          <Heart />
        </div>
        HealthCare
      </h2>
    </div>
    <nav>
      <ul>
        <li>
          <NavLink to="/user/home" className={({ isActive }) => isActive ? "active" : ""}>
            <Home size={18} />
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/booking" className={({ isActive }) => isActive ? "active" : ""}>
            <CalendarCheck size={18} />
            Đặt lịch tư vấn
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/test-booking" className={({ isActive }) => isActive ? "active" : ""}>
            <TestTube size={18} />
            Đặt lịch xét nghiệm
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/faq" className={({ isActive }) => isActive ? "active" : ""}>
            <HelpCircle size={18} />
            Hỏi đáp
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

export default UserSidebar;