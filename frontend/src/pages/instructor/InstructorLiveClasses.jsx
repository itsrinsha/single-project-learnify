import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorDashboard } from '../../features/instructor/instructorThunk';
import { 
  Video, 
  Calendar, 
  Users, 
  Plus, 
  Search, 
  Play, 
  Clock, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  VideoOff,
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react';
import { 
  getInstructorLiveSessions, 
  createLiveSession, 
  startLiveSession, 
  endLiveSession,
  deleteLiveSession
} from '../../services/liveService';
import { toast } from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';


const InstructorLiveClasses = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.instructor);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleRefresh = () => {
      fetchSessions();
    };

    socket.on("liveClassCreated", handleRefresh);
    socket.on("liveClassUpdated", handleRefresh);
    socket.on("liveClassDeleted", handleRefresh);

    return () => {
      socket.off("liveClassCreated", handleRefresh);
      socket.off("liveClassUpdated", handleRefresh);
      socket.off("liveClassDeleted", handleRefresh);
    };
  }, [socket]);

  useEffect(() => {
    if (!dashboardData) {
      dispatch(fetchInstructorDashboard());
    }
  }, [dispatch, dashboardData]);

  const courses = dashboardData?.courses || [];

  useEffect(() => {
    if (courses.length > 0 && !courseId) {
      setCourseId(courses[0]._id);
    }
  }, [courses, courseId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getInstructorLiveSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      toast.error('Failed to load live sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a class title');
    if (!courseId) return toast.error('Please select a course');
    if (!scheduledDate) return toast.error('Please select a date');
    if (!scheduledTime) return toast.error('Please select a time');
    if (!meetingLink.trim()) return toast.error('Please enter a meeting link');

    try {
      setSubmitting(true);
      const startTime = new Date(`${scheduledDate}T${scheduledTime}`);
      await createLiveSession({
        title,
        course: courseId,
        startTime,
        meetingLink
      });
      toast.success('Live class scheduled successfully!');
      setShowScheduleForm(false);
      setTitle('');
      setScheduledDate('');
      setScheduledTime('');
      setMeetingLink('');
      fetchSessions();
    } catch (error) {
      console.error('Error scheduling live class:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule live class');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartSession = async (id) => {
    try {
      await startLiveSession(id);
      toast.success('Live session started!');
      fetchSessions();
    } catch (error) {
      console.error('Error starting live session:', error);
      toast.error(error.response?.data?.message || 'Failed to start live session');
    }
  };

  const handleEndSession = async (id) => {
    try {
      await endLiveSession(id);
      toast.success('Live session ended!');
      fetchSessions();
    } catch (error) {
      console.error('Error ending live session:', error);
      toast.error(error.response?.data?.message || 'Failed to end live session');
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm('Are you sure you want to delete this live class session?')) return;
    try {
      await deleteLiveSession(id);
      toast.success('Live session deleted successfully!');
      fetchSessions();
    } catch (error) {
      console.error('Error deleting live session:', error);
      toast.error(error.response?.data?.message || 'Failed to delete live session');
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    // A session is completed if it has explicitly been marked completed,
    // or if it was scheduled more than 24 hours ago and was never started (expired)
    const isPast = session.isCompleted || (!session.isLive && sessionDate < new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    // Tab match
    const tabMatch = activeTab === 'upcoming' ? !isPast : isPast;

    // Search match
    const searchMatch = session.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        session.course?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Live Classes</h2>
          <p className="text-slate-500 mt-1 font-medium">Host real-time interactive sessions with your enrolled students.</p>
        </div>
        <button 
          onClick={() => setShowScheduleForm(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={20} />
          Schedule Live Class
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-2">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'upcoming' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Upcoming / Live
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'completed' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Completed
        </button>
        <div className="flex-1"></div>
        <div className="relative w-full md:w-64">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Class List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-16 text-center flex flex-col items-center gap-4">
          <Video size={48} className="text-slate-300" />
          <p className="text-slate-500 font-medium">No live classes found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredSessions.map((session) => (
            <div key={session._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-300 transition-all group">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center border-2 ${
                  session.isLive ? 'bg-red-50 border-red-100 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}>
                  <Calendar size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      session.isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'
                    }`}>
                      {session.isLive ? 'Live Now' : 'Upcoming'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">
                      {session.course?.title}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 line-clamp-1">{session.title}</h4>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {session.meetingLink && (
                      <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline font-bold">
                        <ExternalLink size={16} /> Link: {session.meetingLink}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!session.isLive && (
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="p-4 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-all active:scale-95 flex items-center justify-center border border-slate-200 hover:border-red-100"
                      title="Delete Session"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  {session.isLive ? (
                    <button 
                      onClick={() => handleEndSession(session._id)}
                      className="px-6 py-4 bg-red-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95"
                    >
                      End Live Stream
                    </button>
                  ) : (
                    // Only show Start if it's not completed, and was scheduled for future OR within the last 24 hours
                    !session.isCompleted && new Date(session.startTime) >= new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                      <button 
                        onClick={() => handleStartSession(session._id)}
                        className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95"
                      >
                        Start Live Stream
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-start justify-center p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
            <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">Schedule Live Class</h3>
                <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">Fill in the details to notify your students.</p>
              </div>
              <button onClick={() => setShowScheduleForm(false)} className="p-2.5 hover:bg-white rounded-2xl text-slate-400 transition-colors shadow-sm">
                <XCircle size={22} />
              </button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Class Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Advanced State Management Workshop" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Course</label>
                  <select 
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                  >
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                    {courses.length === 0 && <option disabled>No courses available</option>}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Audience</label>
                  <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
                    <option>All Enrolled Students</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                  <input 
                    type="date" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    onClick={(e) => e.target.showPicker()}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                  <input 
                    type="time" 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    onClick={(e) => e.target.showPicker()}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Meeting Link</label>
                <input 
                  type="url" 
                  placeholder="https://meet.google.com/..." 
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Scheduling...' : 'Schedule Live Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorLiveClasses;
