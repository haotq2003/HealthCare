import React, { useState } from 'react';
import ConsultantHeader from './ConsultantHeader';
import ConsultantSidebar from './ConsultantSidebar';
import { Outlet } from 'react-router-dom';

const ConsultantLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ConsultantSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ConsultantHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ConsultantLayout;
