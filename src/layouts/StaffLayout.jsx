import React from "react";
import Sidebar from "../components/Staff/StaffSidebar";
import "./MainLayout.scss";
import { Outlet } from "react-router-dom";

const StaffLayout = () => (
  <div className="staff-main-layout">
    <Sidebar />
    <div className="staff-main-content">
      <div className="staff-page-content">
        <Outlet />
      </div>
    </div>
  </div>
);

export default StaffLayout; 