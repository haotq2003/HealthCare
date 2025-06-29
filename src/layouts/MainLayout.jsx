import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/HomePage/Header/Header";
import Footer from "../components/HomePage/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 