import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';
import { 
  BookOpen, 
  Users, 
  Video, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Loader2
} from 'lucide-react';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.instructor);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  if (loading && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Crunching your numbers...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Courses', value: dashboardData?.totalCourses || 0, icon: <BookOpen className="text-primary-650 w-5 h-5" />, bg: 'bg-primary-50 border-primary-100/50', sub: `${dashboardData?.publishedCourses || 0} Published` },
    { label: 'Total Students', value: dashboardData?.totalStudents || 0, icon: <Users className="text-purple-650 w-5 h-5" />, bg: 'bg-purple-50 border-purple-100/50', sub: 'Unique learners' },
    { label: 'Total Earnings', value: `₹${dashboardData?.totalEarnings?.toLocaleString() || 0}`, icon: <DollarSign className="text-emerald-650 w-5 h-5" />, bg: 'bg-emerald-50 border-emerald-100/50', sub: 'Total Revenue' },
    { label: 'Total Enrollments', value: dashboardData?.enrolledStudents || 0, icon: <Users className="text-blue-650 w-5 h-5" />, bg: 'bg-blue-50 border-blue-100/50', sub: 'Course purchases' },
  ];

  const recentApprovals = (dashboardData?.courses || []).slice(0, 3).map(c => ({
    id: c._id,
    course: c.title,
    status: c.status === 'published' ? 'Approved' : c.status === 'draft' ? 'Draft' : 'Pending',
    date: new Date(c.updatedAt).toLocaleDateString()
  }));

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Instructor Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Hello, {user?.name || 'Instructor'}. Here is your teaching overview.</p>
        </div>
        <button onClick={() => navigate('/instructor/earnings')} className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5">
          <TrendingUp size={14} />
          View Earnings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 ${stat.bg} border rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global</span>
            </div>
            <div className="mt-4 space-y-0.5">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-[9px] font-black text-primary-600 uppercase tracking-widest">
              {stat.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Classes Snapshot */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Sessions</h3>
              <button className="text-primary-600 text-xs font-bold hover:text-primary-700 uppercase tracking-wider">Manage Sessions</button>
            </div>
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-350 mx-auto border border-slate-150">
                <Video size={28} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">No Active Live Sessions</p>
                <p className="text-slate-500 text-xs mt-1">Engage with your students in real time. Launch a live session instantly.</p>
              </div>
              <button className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-primary-600/5">
                New Live Class
              </button>
            </div>
          </div>

          {/* Course Performance */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Course Performance</h3>
            <div className="space-y-6">
              {(dashboardData?.courses || []).length > 0 ? (
                dashboardData.courses.slice(0, 3).map((course, i) => (
                  <div key={course._id || i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <div>
                        <span className="text-slate-900 font-extrabold">{course.title}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider ml-3">Enrolled: {course.enrolledCount || 0}</span>
                      </div>
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{course.status}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full transition-all duration-700" style={{ width: course.status === 'published' ? '100%' : '20%' }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-450 font-bold uppercase tracking-widest italic">No performance data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Recent Course List */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/20">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Courses</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentApprovals.length > 0 ? recentApprovals.map((item) => (
                <div key={item.id} className="p-4.5 space-y-1.5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{item.course}</h4>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-550 border border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Updated: {item.date}</p>
                </div>
              )) : (
                <div className="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest italic">No records found</div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
