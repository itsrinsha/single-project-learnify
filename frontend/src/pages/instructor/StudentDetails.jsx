import React from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Video, 
  History, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const student = {
  id: 1,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  avatar: 'https://i.pravatar.cc/300?u=alice',
  joinDate: 'May 01, 2026',
  totalSpent: 'Rs. 4,999',
  courses: [
    {
      id: 1,
      title: 'Advanced React 19 Patterns',
      lastActive: 'Today',
      progress: 80,
      completedLessons: 12,
      totalLessons: 15,
      attendance: '92%',
      reviewStatus: 'Pending',
      topics: ['Performance', 'Hooks', 'Testing']
    }
  ],
  reviewHistory: [
    {
      id: 1,
      course: 'Advanced React 19 Patterns',
      date: 'May 06, 2026',
      attempt: 1,
      result: 'Needs Work',
      notes: 'Good fundamentals, needs more practice with state management.'
    }
  ]
};

const StudentDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10 pb-20">
      {/* Header / Profile Info */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <img src={student.avatar} alt={student.name} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl border-8 border-slate-50" />
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
               <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{student.name}</h2>
              <p className="text-slate-500 font-bold flex items-center justify-center md:justify-start gap-2 mt-2">
                <Mail size={16} className="text-blue-600" /> {student.email}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-8">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled Since</p>
                  <p className="text-sm font-black text-slate-900">{student.joinDate}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Investment</p>
                  <p className="text-sm font-black text-slate-900">{student.totalSpent}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                  <p className="text-sm font-black text-blue-600">Top 5%</p>
               </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-auto">
             <button 
              onClick={() => navigate('/instructor/messages')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-100"
            >
               <MessageSquare size={18} /> Message Student
             </button>
             <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
               <Calendar size={18} /> Schedule Review
             </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Course Progress */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900">Purchased Courses</h3>
            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              {student.courses.length} Active Courses
            </span>
          </div>

          <div className="grid gap-8">
            {student.courses.map((course) => (
              <div key={course.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-xl transition-all space-y-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} /> Last Active: {course.lastActive}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">{course.progress}%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completion</p>
                     </div>
                     <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        <TrendingUp size={28} />
                     </div>
                  </div>
                </div>

                <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>

                <div className="grid sm:grid-cols-3 gap-8 py-6 border-y border-slate-50">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lessons Done</p>
                      <p className="text-sm font-black text-slate-900">{course.completedLessons} / {course.totalLessons}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Attendance</p>
                      <p className="text-sm font-black text-slate-900">{course.attendance}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Status</p>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        course.reviewStatus === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {course.reviewStatus}
                      </span>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Topics</p>
                   <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black rounded-xl border border-slate-100 uppercase tracking-widest">
                          {topic}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Review History */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900">Review History</h3>
              <History size={18} className="text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50">
               {student.reviewHistory.map((h) => (
                 <div key={h.id} className="p-6 space-y-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900">{h.course}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h.date} • Attempt {h.attempt}</p>
                       </div>
                       <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-600">
                         {h.result}
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 italic leading-relaxed">"{h.notes}"</p>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-widest">
              View All History
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl"></div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Award size={20} className="text-yellow-400" />
                  </div>
                  <h3 className="font-bold">Certifications</h3>
               </div>
               <p className="text-xs text-slate-400 font-medium">Student has not earned any certificates from your courses yet. They need to pass a review session.</p>
               <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="text-blue-400 flex-shrink-0" size={18} />
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed">Alice is eligible for a review in 'Advanced React 19' (Progress 80%).</p>
               </div>
               <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40">
                 Invite to Review
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
