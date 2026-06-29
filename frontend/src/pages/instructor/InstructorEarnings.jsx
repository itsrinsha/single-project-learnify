import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Download, 
  Calendar, 
  ChevronDown, 
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  History,
  BookOpen,
  Users
} from 'lucide-react';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const InstructorEarnings = () => {
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.instructor);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  const stats = dashboardData || {};
  const courses = dashboardData?.courses || [];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Financial Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Track your earnings, payouts, and revenue growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-slate-300 hover:shadow-sm transition-all">
              <Calendar size={16} className="text-blue-600" />
              {timeframe}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {/* Simple Dropdown Mock */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <div className="p-2 flex flex-col gap-1">
                {['This Week', 'Last 30 Days', 'This Year', 'All Time'].map(tf => (
                  <button key={tf} onClick={() => setTimeframe(tf)} className="text-left px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg">
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md active:scale-95">
            <Download size={16} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Net Earnings', amount: stats.totalEarnings, icon: <DollarSign size={24} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
          { title: 'Published Courses', amount: stats.publishedCourses, icon: <BookOpen size={24} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
          { title: 'Total Students', amount: stats.totalStudents, icon: <Users size={24} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
          { title: 'Total Courses', amount: stats.totalCourses, icon: <CreditCard size={24} />, color: 'bg-purple-50 text-purple-600 border-purple-100' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${kpi.color} mb-6`}>
              {kpi.icon}
            </div>
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider">{kpi.title}</h3>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{kpi.title.includes('Earnings') ? formatCurrency(kpi.amount) : (kpi.amount || 0)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Revenue Chart Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <Activity className="text-blue-600" /> Revenue Overview
            </h2>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-10">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => {
              const heightPercent = [30, 45, 35, 60, 85, 75][idx];
              
              return (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="w-full flex justify-center relative h-full items-end">
                    <div 
                      className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-xl transition-all duration-500 group-hover:opacity-80 relative overflow-hidden"
                      style={{ height: `${heightPercent}%` }}
                    >
                    </div>
                  </div>
                  <span className="text-slate-500 font-bold text-sm">{month}</span>
                </div>
              );
            })}
          </div>
        </div>


      </div>

      {/* Lower Grid: Courses & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Course-wise Earnings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <BookOpen className="text-purple-600" /> Earnings by Course
          </h2>
          <div className="space-y-5">
            {courses.length > 0 ? courses.map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <PieChart size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">{course.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold">{course.enrolledCount || 0} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">{formatCurrency((course.enrolledCount || 0) * course.price)}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-center py-6 italic">No earnings data yet.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions Placeholder */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <History className="text-amber-600" /> Recent Activity
            </h2>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <Activity size={40} />
            </div>
            <p className="text-slate-500 font-medium">Transaction history will appear here once you make sales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorEarnings;
