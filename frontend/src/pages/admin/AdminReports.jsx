import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Download,
  Calendar,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminReports = () => {
  const [reportsData, setReportsData] = useState({
    summary: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      totalCourses: 0
    },
    revenueGrowth: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const isDateRangeInvalid = fromDate && toDate && toDate < fromDate;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async (from = '', to = '') => {
    try {
      setLoading(true);
      const data = await adminService.getReportsData(from, to);
      console.log('Reports Data Received:', data); // Added logging
      setReportsData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Could not load platform analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleFromDateChange = (val) => {
    setFromDate(val);
    if (val && toDate && toDate < val) {
      setToDate('');
    }
  };

  const handleFilterApply = () => {
    const now = new Date();
    
    if (fromDate) {
      const from = new Date(fromDate);
      if (from > now) {
        toast.error("From Date cannot be in the future");
        return;
      }
    }
    
    if (toDate) {
      const to = new Date(toDate);
      if (to > now) {
        toast.error("To Date cannot be in the future");
        return;
      }
    }
    
    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        toast.error("From Date cannot be after To Date");
        return;
      }
    }
    
    fetchReports(fromDate, toDate);
  };

  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    fetchReports('', '');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Analyzing platform data...</p>
      </div>
    );
  }

  const hasRevenueData = reportsData.revenueGrowth && reportsData.revenueGrowth.length > 0;
  const hasUserData = reportsData.userGrowth && reportsData.userGrowth.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Analytics</h2>
          <p className="text-slate-500">Comprehensive reports and data visualizations of platform growth.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Download className="w-5 h-5" /> Export All Reports
        </button>
      </div>

      {/* Date Filter Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="date"
                value={fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none font-bold text-slate-600 cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                onClick={(e) => e.target.showPicker()}
                className={`w-full pl-11 pr-4 py-2.5 bg-slate-50 border focus:bg-white focus:ring-4 rounded-xl text-sm transition-all outline-none font-bold cursor-pointer ${
                  isDateRangeInvalid 
                    ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10 text-error-600' 
                    : 'border-slate-100 focus:border-blue-500 focus:ring-blue-500/10 text-slate-600'
                }`}
              />
            </div>
            {isDateRangeInvalid && (
              <p className="text-xs font-bold text-error-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                To Date cannot be earlier than From Date.
              </p>
            )}
          </div>
        </div>
        <div className="w-full md:w-auto flex items-end gap-3 mt-4 md:mt-0 pt-5 md:pt-0">
          <button 
            onClick={handleFilterApply}
            disabled={isDateRangeInvalid}
            className={`flex-1 md:flex-initial px-6 py-3 bg-blue-600 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/15 ${
              isDateRangeInvalid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            Apply Filters
          </button>
          {(fromDate || toDate) && (
            <button 
              onClick={handleClearFilters}
              className="px-6 py-3 bg-slate-100 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchReports} className="ml-auto text-xs bg-white px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50">Retry</button>
        </div>
      )}

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Revenue Growth</h3>
            <div className="flex gap-2">
               <span className="flex items-center gap-1 text-xs font-bold text-blue-600"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Revenue (₹)</span>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            {hasRevenueData ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={reportsData.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">No revenue data available for this period.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">User Acquisition</h3>
            <select className="text-xs font-bold bg-slate-50 border-none rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="flex-1 w-full relative">
            {hasUserData ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={reportsData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 italic">No user growth data available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${reportsData.summary.totalRevenue.toLocaleString()}`, stat: 'All time', icon: BarChart3, color: 'blue' },
          { label: 'Total Users', value: reportsData.summary.totalUsers.toLocaleString(), stat: 'Instructors & Students', icon: Users, color: 'purple' },
          { label: 'Total Courses', value: reportsData.summary.totalCourses.toLocaleString(), stat: 'Platform wide', icon: BookOpen, color: 'green' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="relative">
              <div className="p-3 bg-slate-50 w-fit rounded-xl mb-4">
                <item.icon className="w-6 h-6 text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{item.label}</p>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{item.value}</h4>
              <p className={`text-xs font-bold ${item.color === 'blue' ? 'text-blue-600' : item.color === 'purple' ? 'text-purple-600' : 'text-green-600'}`}>{item.stat}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
