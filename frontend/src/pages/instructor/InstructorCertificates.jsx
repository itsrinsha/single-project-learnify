import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Check, 
  X, 
  Search, 
  Calendar, 
  User, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPendingCertificates, approveCertificate, rejectCertificate } from '../../services/certificateService';

const InstructorCertificates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  
  // Rejection modal states
  const [rejectId, setRejectId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingCertificates();
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching pending certificates:', error);
      toast.error('Failed to load pending certificate requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      setSubmittingId(id);
      await approveCertificate(id);
      toast.success("Certificate request successfully approved and issued!");
      fetchPendingRequests();
    } catch (error) {
      console.error("Error approving certificate:", error);
      toast.error(error.response?.data?.message || "Failed to approve certificate.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectId || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      setSubmittingId(rejectId);
      await rejectCertificate(rejectId, rejectionReason);
      toast.success("Certificate request successfully rejected.");
      setRejectId(null);
      setRejectionReason("");
      fetchPendingRequests();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      toast.error(error.response?.data?.message || "Failed to reject certificate.");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredRequests = requests.filter(req => 
    req.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.certificateId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.certificateCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Award size={36} className="text-blue-600" />
            Certificate Approvals
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Review, approve, or reject certificate requests from students who completed courses.</p>
        </div>
      </div>

      {/* Filter / Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96 flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student, course, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          {filteredRequests.length} Requests Pending
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading certificate requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100 animate-pulse">
            <Award size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No pending approvals</h3>
          <p className="text-slate-400 mt-2 max-w-md mx-auto font-medium">When students complete courses, pass required exams, and complete mission tasks, their certificate requests will appear here for your approval.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filteredRequests.map((req) => (
            <div 
              key={req._id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-amber-50 text-amber-600 border-amber-100 animate-pulse">
                    Pending Approval
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Grade: {req.grade || "N/A"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{req.course?.title}</h3>
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                    <User size={14} /> Student: {req.student?.name} ({req.student?.email})
                  </p>
                </div>

                {/* Progress Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Course Progress</span>
                    <span className="text-blue-600">{req.progressPercentage || 100}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all" 
                      style={{ width: `${req.progressPercentage || 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    Completed Lessons: {req.completedLessonsCount || 0}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-500" />
                    Completed Date: {new Date(req.completionDate || req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  disabled={submittingId !== null}
                  onClick={() => setRejectId(req._id)}
                  className="w-1/2 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-red-100"
                >
                  <X size={14} />
                  Reject Request
                </button>
                <button
                  disabled={submittingId !== null}
                  onClick={() => handleApprove(req._id)}
                  className="w-1/2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-green-100"
                >
                  {submittingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={14} />}
                  Approve & Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Reason Input Modal */}
      {rejectId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Reject Certificate Request</h3>
              <p className="text-slate-500 text-xs mt-1">Please provide a reason for rejecting this certificate request. The student will be notified.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Rejection Reason</label>
              <textarea
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. You must revise your coding task or mission submission. Project code needs alignment corrections..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white focus:border-red-400 transition-all"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setRejectId(null);
                  setRejectionReason("");
                }}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectSubmit()}
                disabled={submittingId !== null || !rejectionReason.trim()}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs active:scale-95 transition-all shadow-lg shadow-red-100 disabled:bg-red-400"
              >
                {submittingId ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCertificates;
