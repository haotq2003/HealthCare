import React, { useState } from 'react';
import ManagerHeader from './ManagerHeader';
import ManagerSidebar from './ManagerSidebar';
import { Outlet } from 'react-router-dom';

const ManagerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <ManagerSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Main layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ManagerHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
