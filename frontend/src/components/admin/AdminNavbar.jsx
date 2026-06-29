import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  User as UserIcon
} from 'lucide-react';

const AdminNavbar = ({ toggleSidebar, isSidebarOpen, title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-slate-50 lg:hidden text-slate-500 cursor-pointer"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:block w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search platform..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500 outline-none transition-all duration-200 font-semibold"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl relative transition-colors cursor-pointer">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-600 rounded-full"></span>
          </button>
        </div>

        {/* User Profile */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <Link to="/admin/profile" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 overflow-hidden group-hover:ring-4 group-hover:ring-primary-500/10 transition-all border border-primary-100">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon size={14} />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-tight">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
              {user?.role || 'Super Admin'}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default AdminNavbar;
