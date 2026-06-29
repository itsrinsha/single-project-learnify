import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Map path to title
  const getPageTitle = (path) => {
    const titles = {
      '/admin/dashboard': 'Dashboard Overview',
      '/admin/students': 'Student Management',
      '/admin/instructors': 'Instructor Management',
      '/admin/course-approval': 'Course Approvals',
      '/admin/categories': 'Category Management',
      '/admin/offers': 'Offer Management',
      '/admin/live-classes': 'Live Class Monitoring',
      '/admin/availability': 'Instructor Availability',
      '/admin/payments': 'Payment Transactions',
      '/admin/earnings': 'Earnings & Revenue',
      '/admin/user-blocks': 'Access Control',
      '/admin/reports': 'Platform Analytics',
      '/admin/profile': 'My Profile',
    };
    return titles[path] || 'Admin Panel';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden h-screen">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 lg:ml-64">
        <AdminNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          title={getPageTitle(location.pathname)}
        />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
