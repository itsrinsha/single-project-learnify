import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    platformProfit: 0,
    pendingPayouts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [paymentsData, earningsData] = await Promise.all([
        adminService.getAllPayments(),
        adminService.getEarnings()
      ]);
      setPayments(paymentsData);
      setStats(earningsData);
    } catch (err) {
      console.error('Failed to fetch payment data', err);
      setError('Unable to load payment transactions');
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(tx => 
    tx.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Fetching transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Data</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Payment Transactions</h2>
          <p className="text-slate-500">Monitor all course purchases and platform revenue transactions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Download Statement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Gross Revenue</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue.toLocaleString()}</h3>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <ArrowUpRight className="w-3 h-3" /> Live
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Admin Commission (20%)</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">₹{stats.platformProfit.toLocaleString()}</h3>
            <span className="text-xs font-bold text-slate-400">Platform Profit</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Instructor Payouts (80%)</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-slate-900">₹{stats.instructorPayouts?.toLocaleString() || 0}</h3>
            <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
              Community Earnings
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions, students..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
            />
          </div>
          <select className="bg-slate-50 border-none text-sm font-medium text-slate-600 rounded-xl focus:ring-0 px-4 py-2">
            <option>All Transactions</option>
            <option>Last 30 Days</option>
            <option>Today</option>
          </select>
          <button className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Breakup</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length > 0 ? filteredPayments.map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{tx.transactionId || tx._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{tx.paymentMethod || 'Razorpay'} • {formatDate(tx.createdAt)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.course?.title || 'Course Access'}</p>
                      <p className="text-xs text-slate-500">To {tx.user?.name || 'Student'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">₹{tx.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Admin (20%)</span>
                        <span className="text-xs font-bold text-blue-600">₹{(tx.amount * 0.2).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Inst. (80%)</span>
                        <span className="text-xs font-bold text-slate-700">₹{(tx.amount * 0.8).toFixed(2)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tx.status === 'paid' ? 'bg-green-100 text-green-600' : 
                      tx.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreHorizontal className="w-5 h-5 text-slate-400" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
