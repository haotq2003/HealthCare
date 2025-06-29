import React from "react";
import UserSidebar from "../components/User/UserSidebar";
import "./UserLayout.scss";
import { Outlet } from "react-router-dom";

const UserLayout = () => (
  <div className="user-layout">
    <UserSidebar />
    <main className="user-main-content">
      <Outlet />
    </main>
  </div>
);

export default UserLayout; 