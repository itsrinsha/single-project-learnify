import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Users, 
  Star, 
  Video, 
  Edit3, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';
import { deleteCourse } from '../../services/instructorCourseService';
import { toast } from 'react-hot-toast';

const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.instructor);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  const [activeTab, setActiveTab] = React.useState('approved');
  const coursesList = dashboardData?.courses || [];

  const approvedCourses = coursesList.filter(c => c.approvalStatus === 'approved');
  const pendingCourses = coursesList.filter(c => c.approvalStatus === 'pending');
  const rejectedCourses = coursesList.filter(c => c.approvalStatus === 'rejected');

  const displayedCourses = activeTab === 'approved' ? approvedCourses : activeTab === 'pending' ? pendingCourses : rejectedCourses;

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    
    const loadingToast = toast.loading("Deleting course...");
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully", { id: loadingToast });
      dispatch(fetchInstructorDashboard()); // Refresh list
    } catch (error) {
      toast.error("Failed to delete course", { id: loadingToast });
    }
  };

  if (loading && coursesList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your course catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Course Management</h2>
          <p className="text-slate-500 mt-1 font-medium">Create, edit, and track the performance of your educational content.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/add-course')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-100">
        {[
          { id: 'approved', label: 'Approved', count: approvedCourses.length },
          { id: 'pending', label: 'Pending Approval', count: pendingCourses.length },
          { id: 'rejected', label: 'Rejected', count: rejectedCourses.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-full text-[10px]">{tab.count}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="grid gap-6">
        {displayedCourses.length > 0 ? displayedCourses.map((course) => (
          <div key={course._id} className="card group overflow-hidden hover:border-primary-300 transition-all">
            <div className="flex flex-col lg:flex-row">
              {/* Thumbnail Area */}
              <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden flex-shrink-0 bg-slate-100 border-r border-slate-100">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className="bg-white px-2 py-1 rounded shadow-sm flex items-center gap-2 border border-slate-200">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      course.status === 'published' ? 'bg-success-500' : 'bg-warning-500'
                    }`}></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-700">{course.status}</span>
                  </div>
                  {course.isHidden && (
                    <div className="bg-slate-900 text-white px-2 py-1 rounded shadow-sm flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest">Hidden</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Area */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-primary-600 font-bold text-[10px] uppercase tracking-widest">{course.category}</p>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors cursor-pointer" onClick={() => navigate(`/instructor/edit-course/${course._id}`)}>{course.title}</h3>
                      {course.approvalStatus === 'pending' && (
                        <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold uppercase mt-1">
                          <Clock size={12} /> Under Review
                        </div>
                      )}
                      {course.approvalStatus === 'rejected' && (
                        <div className="flex items-center gap-1.5 text-red-600 text-[10px] font-bold uppercase mt-1">
                          <AlertCircle size={12} /> Needs Changes
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900 tracking-tight">₹{course.price?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 py-4 border-y border-slate-50">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">{course.enrolledStudentsCount || 0} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">
                        {course.duration || '0h'} duration
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 mt-auto">
                  <button 
                    onClick={() => navigate(`/instructor/edit-course/${course._id}`)}
                    className="btn-primary py-2 px-6 text-xs flex items-center gap-2"
                  >
                    <Edit3 size={14} />
                    {course.approvalStatus === 'approved' ? 'Edit & Resubmit' : 'Edit Course'}
                  </button>
                  <button 
                    onClick={() => navigate(`/instructor/students/${course._id}`)}
                    className="px-6 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
                  >
                    <Users size={14} />
                    Roster
                  </button>
                  <div className="flex-1"></div>
                  <button 
                    onClick={() => handleDelete(course._id)}
                    className="text-slate-400 hover:text-error-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="card border-dashed py-20 text-center bg-slate-50">
            <BookOpen size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-widest">No Courses Found</h3>
            <p className="text-slate-500 mt-1 text-xs">You don't have any courses in the {activeTab} status.</p>
            {activeTab === 'approved' && (
              <button 
                onClick={() => navigate('/instructor/add-course')}
                className="mt-8 btn-primary px-10"
              >
                Get Started
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Summary Footer */}
      <div className="bg-primary-900 rounded-lg p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-primary-400 font-bold text-[10px] uppercase tracking-widest">Lifetime Courses</p>
            <h4 className="text-3xl font-bold">{dashboardData?.stats?.totalCourses || 0}</h4>
          </div>
          <div className="space-y-1 border-y md:border-y-0 md:border-x border-primary-800 py-6 md:py-0 md:px-8">
            <p className="text-primary-400 font-bold text-[10px] uppercase tracking-widest">Total Active Students</p>
            <h4 className="text-3xl font-bold">{dashboardData?.stats?.totalStudents || 0}</h4>
          </div>
          <div className="space-y-1">
            <p className="text-primary-400 font-bold text-[10px] uppercase tracking-widest">Aggregate Revenue</p>
            <h4 className="text-3xl font-bold">₹{dashboardData?.stats?.totalEarnings?.toLocaleString() || 0}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
