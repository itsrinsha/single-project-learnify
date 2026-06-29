import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  Loader2,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getEarnings } from '../../services/adminService';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#64748b'];

const AdminEarnings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const result = await getEarnings();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      setError('Failed to load earnings data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading earnings data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <div className="p-4 bg-red-50 rounded-full text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="max-w-md">
          <h3 className="text-lg font-bold text-slate-900">Oops! Something went wrong</h3>
          <p className="text-slate-500 mt-2">{error}</p>
          <button 
            onClick={fetchEarnings}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', value: formatCurrency(data?.totalRevenue), icon: IndianRupee, color: 'blue' },
    { title: 'Platform Profit', value: formatCurrency(data?.platformProfit), icon: TrendingUp, color: 'green' },
    { title: 'Instructor Payouts', value: formatCurrency(data?.instructorPayouts), icon: PieChart, color: 'purple' },
    { title: 'Pending Payouts', value: formatCurrency(data?.pendingPayouts), icon: BarChart, color: 'amber' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Earnings & Revenue</h2>
          <p className="text-slate-500">Track platform profitability and instructor payouts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Custom Range
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 text-slate-600`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Revenue Performance</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">Revenue</button>
            </div>
          </div>
          <div className="h-[350px] w-full min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ReBarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Wise Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by Category</h3>
          <div className="space-y-6">
            {data?.categoryData?.length > 0 ? (
              data.categoryData.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${cat.percent}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">No category data available</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-colors">
            View Detailed Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEarnings;
