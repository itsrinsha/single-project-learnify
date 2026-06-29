import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Video, 
  DollarSign, 
  UserX, 
  AlertCircle,
  MoreVertical,
  ArrowRight,
  Loader2,
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalInstructors: 0,
      totalCourses: 0,
      pendingApprovals: 0,
      totalRevenue: 0,
      chartData: []
    },
    activities: [],
    pendingRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, activities, pendingRequests] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getActivityFeed(),
        adminService.getInstructorRequests()
      ]);

      setDashboardData({
        stats,
        activities,
        pendingRequests: pendingRequests.slice(0, 5)
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm">Loading platform overview...</p>
      </div>
    );
  }

  const { stats, activities, pendingRequests } = dashboardData;

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-250/10 pb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Overview</h2>
          <p className="text-slate-500 mt-1 font-semibold text-sm">Global statistics and recent administrative activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            Export Report
          </button>
          <button className="btn-primary">
            Platform Settings
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-50 border border-error-100 rounded-xl flex items-center gap-4 text-error-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchDashboardData} className="ml-auto bg-white px-3 py-1 rounded-lg border border-error-200 text-xs font-bold transition-colors cursor-pointer hover:bg-error-50">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents.toLocaleString()} icon={Users} color="blue" />
        <StatCard title="Total Instructors" value={stats.totalInstructors.toLocaleString()} icon={GraduationCap} color="purple" />
        <StatCard title="Pending Review" value={stats.pendingApprovals} icon={Clock} color="amber" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue performance</h3>
            </div>
            <select className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-slate-400 focus:ring-0 cursor-pointer">
              <option>Annual View</option>
            </select>
          </div>
          <div className="p-8 h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%" >
              <AreaChart data={stats.chartData.length > 0 ? stats.chartData : [{name: 'No Data', revenue: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none'}} 
                  labelStyle={{fontWeight: 700, color: '#0f172a', fontSize: '12px'}}
                  itemStyle={{fontSize: '12px', color: '#7c3aed'}}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fillOpacity={0.05} fill="#7c3aed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Activity Feed */}
        <div className="card overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-550 uppercase tracking-widest">Activity Feed</h3>
            <button className="text-primary-600 hover:text-primary-700 text-[10px] font-bold uppercase tracking-widest cursor-pointer">View All</button>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {activities.length > 0 ? activities.map((activity, i) => (
              <div key={activity.id || i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 ${
                  activity.type === 'instructor' ? 'bg-primary-50 text-primary-700' :
                  activity.type === 'course' ? 'bg-warning-50 text-warning-600' :
                  activity.type === 'payment' ? 'bg-success-50 text-success-600' : 'bg-slate-50 text-slate-650'
                }`}>
                   <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    <span className="text-primary-650 font-extrabold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-[10px] text-slate-450 font-bold mt-1 uppercase tracking-wider">{formatTime(activity.time)}</p>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-355 font-bold uppercase tracking-widest text-[10px]">No recent data</div>
            )}
          </div>
        </div>
      </div>

      {/* Instructor Requests Table */}
      <div className="card overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xs font-bold text-slate-550 uppercase tracking-widest">Pending Instructor Applications</h3>
          </div>
          <Link to="/admin/instructors" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <MoreVertical size={18} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expertise</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingRequests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs border border-primary-200">
                        {req.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{req.name}</p>
                        <p className="text-[10px] text-slate-450 font-semibold">{req.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-slate-700">{req.verificationDetails?.expertise || 'N/A'}</p>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-tighter">{req.verificationDetails?.education}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 bg-warning-50 text-warning-600 text-[9px] font-black rounded-lg uppercase tracking-wider border border-warning-200">Pending</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link to="/admin/instructors" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">No pending requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
          <Link to="/admin/instructors" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
            Manage All Instructors <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
