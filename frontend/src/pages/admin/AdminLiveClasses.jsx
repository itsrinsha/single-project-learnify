import React, { useState, useEffect } from 'react';
import { 
  Video, 
  User, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Search,
  Filter,
  Monitor,
  Loader2,
  AlertCircle
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';

const AdminLiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminLiveSessions();
      setSessions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Could not load live sessions.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => 
    session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    if (now > end) return 'Completed';
    if (now >= start && now <= end) return 'Live';
    return 'Scheduled';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Monitoring live events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Class Monitoring</h2>
          <p className="text-slate-500">Monitor and manage all live sessions scheduled on the platform.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchSessions} className="ml-auto text-xs bg-white px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50">Retry</button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search classes, instructors..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.length > 0 ? filteredSessions.map((session) => {
          const status = getStatus(session);
          return (
            <div key={session._id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 ${status === 'Live' ? 'border-l-red-600' : 'border-l-blue-600'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${status === 'Live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{session.title || 'Live Session'}</h3>
                      <p className="text-sm text-slate-500 font-medium">{session.course?.title || 'General Category'}</p>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-slate-50">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Instructor</p>
                      <p className="font-semibold text-slate-900">{session.instructor?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                      <p className="font-semibold text-slate-900">{new Date(session.startTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Enrolled</p>
                      <p className="font-semibold text-slate-900">0 Students</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock className="w-4 h-4" /> Start: {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                      <Monitor className="w-4 h-4" /> Details
                    </button>
                    {status !== 'Completed' && session.meetingLink && (
                      <a 
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
                      >
                        Join Link <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No live sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLiveClasses;
