import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/HomePage/Header/Header";
import Footer from "../components/HomePage/Footer/Footer";
import "./MainLayout.scss";

const MainLayout = () => {
  return (
    <div className="hc-main-layout">
      <div className="hc-main-content">
        <Header />
        <div className="hc-page-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout; 