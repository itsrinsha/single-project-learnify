import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Calendar, 
  Percent, 
  BookOpen, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';



const InstructorOffers = () => {
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Course Offers</h2>
          <p className="text-slate-500 mt-1 font-medium">Create and manage discounts for your approved courses.</p>
        </div>
        <button 
          onClick={() => setShowOfferForm(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Create New Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-900">01</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Offers</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <h4 className="text-3xl font-black text-slate-900">01</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scheduled</p>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center relative z-10">
            <Percent size={28} />
          </div>
          <div className="relative z-10">
            <h4 className="text-3xl font-black">24%</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg. Discount Rate</p>
          </div>
        </div>
      </div>

      {/* Offers List */}
   

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Create New Offer</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Boost your enrollments with limited time discounts.</p>
              </div>
              <button onClick={() => setShowOfferForm(false)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="" disabled>-- Select Course --</option>
                  <option value="react">Advanced React 19 (Approved)</option>
                  <option value="node">Node.js Microservices (Approved)</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium px-1 flex items-center gap-1">
                  <AlertCircle size={10} /> Only approved courses are eligible for offers.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Offer Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1999" 
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Discount %</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  />
                </div>
              </div>
              <div className="pt-6">
                <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
                  Launch Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorOffers;
