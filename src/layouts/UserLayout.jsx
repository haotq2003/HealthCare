import React from "react";
import Header from "../components/HomePage/Header/Header";
import "./UserLayout.scss";
import { Outlet } from "react-router-dom";

const UserLayout = () => (
  <div className="user-layout">
    <Header />
    <main className="user-main-content">
      <Outlet />
    </main>
  </div>
);

export default UserLayout; 