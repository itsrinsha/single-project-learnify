import React from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Wallet
} from 'lucide-react';



const InstructorPayments = () => {
 

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment History</h2>
          <p className="text-slate-500 mt-1 font-medium">Track your course sales and payout status in real-time.</p>
        </div>
        <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95">
          <Download size={20} />
          Export Statements
        </button>
      </div>

      {/* Payout Mechanism Card */}
     

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by student or transaction ID..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            <option>All Payout Status</option>
            <option>Released</option>
            <option>Pending</option>
            <option>On Hold</option>
          </select>
          <button className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (20%)</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Earning</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
           
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorPayments;
