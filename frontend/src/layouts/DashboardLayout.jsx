import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import Navbar from '../components/common/Navbar.jsx';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main workspace container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top bar controls */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Dynamic page contents scrollable */}
        <main className="flex-grow p-6 overflow-y-auto aurora-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
