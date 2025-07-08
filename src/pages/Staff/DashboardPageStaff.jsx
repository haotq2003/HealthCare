import React from 'react';
import StaffSidebar from '../../components/Staff/StaffSidebar';
import { Outlet } from 'react-router-dom';
import './DashboardPage.scss';

const DashboardPage = () => {
  return (
    <div className="staff-dashboard-layout">
      <StaffSidebar />
      <main className="staff-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage; 