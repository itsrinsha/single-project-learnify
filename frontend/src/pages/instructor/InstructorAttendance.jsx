import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Video,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';



const InstructorAttendance = () => {
  

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Tracking</h2>
          <p className="text-slate-500 mt-1 font-medium">Monitor student participation across your live sessions.</p>
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-100 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* Stats Summary */}
     

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search student or class name..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course & Class</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Duration</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rate</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
           
          </table>
        </div>
     
      </div>
    </div>
  );
};

export default InstructorAttendance;
