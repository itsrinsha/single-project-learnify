import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  UserMinus, 
  UserCheck,
  Download,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  DollarSign,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const AdminInstructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      // For simplicity, we'll fetch all users and filter for instructors or use the requests endpoint
      // Let's use the general users endpoint and filter for instructors to show both approved and pending
      const data = await adminService.getAllUsers();
      setInstructors(data.filter(u => u.role === 'instructor'));
      setError(null);
    } catch {
      setError('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleBlockUser = async (id, currentIsBlocked) => {
    const action = currentIsBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} this instructor?`)) return;

    try {
      if (currentIsBlocked) {
        await adminService.unblockUser(id);
        toast.success('Instructor unblocked successfully');
      } else {
        await adminService.blockUser(id, 'Instructor policy violation');
        toast.success('Instructor blocked successfully');
      }
      fetchInstructors();
    } catch {
      toast.error(`Failed to ${action} instructor`);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this instructor?")) return;
    try {
      await adminService.approveInstructor(id);
      toast.success("Instructor approved successfully");
      fetchInstructors();
    } catch (error) {
      toast.error("Failed to approve instructor");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this instructor?")) return;
    try {
      await adminService.rejectInstructor(id);
      toast.success("Instructor rejected");
      fetchInstructors();
    } catch (error) {
      toast.error("Failed to reject instructor");
    }
  };

  const filteredInstructors = instructors.filter(ins => {
    const matchesSearch = ins.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ins.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ins.verificationDetails?.expertise?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Fetching instructor data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Instructor Management</h2>
          <p className="text-slate-500">Approve, monitor, and manage the platform's teaching professionals.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, email or expertise..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredInstructors.map((instructor) => (
          <div key={instructor._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow ${instructor.isBlocked ? 'border-red-200 opacity-80' : 'border-slate-200'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl overflow-hidden ${instructor.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {instructor.profileImage ? (
                      <img src={instructor.profileImage} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      instructor.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{instructor.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {instructor.email}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={instructor.isBlocked ? 'Blocked' : instructor.approvalStatus === 'approved' ? 'Active' : instructor.approvalStatus === 'pending' ? 'Pending' : 'Rejected'} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Joined {new Date(instructor.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Qualification</p>
                    <p className="text-sm text-slate-700 font-medium">{instructor.verificationDetails?.education || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Academic Institution</p>
                    <p className="text-sm text-slate-700 font-medium">{instructor.verificationDetails?.college || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Subjects / Expertise</p>
                    <p className="text-sm text-slate-700 font-medium">{instructor.verificationDetails?.expertise || 'N/A'}</p>
                  </div>
                </div>
                {instructor.isBlocked && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-3">
                    <UserMinus className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase">Blocked Reason</p>
                      <p className="text-sm text-red-600">{instructor.blockedReason || 'Policy violation'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between gap-3 border-t border-slate-100">
              <button className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" /> Details
              </button>
              
              {instructor.approvalStatus === 'pending' && (
                <>
                  <button 
                    onClick={() => handleApprove(instructor._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => handleReject(instructor._id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}

              {instructor.approvalStatus === 'approved' && (
                <button 
                  onClick={() => handleBlockUser(instructor._id, instructor.isBlocked)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${instructor.isBlocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  {instructor.isBlocked ? <><UserCheck className="w-4 h-4" /> Unblock</> : <><UserMinus className="w-4 h-4" /> Block</>}
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredInstructors.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium">No instructors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInstructors;
