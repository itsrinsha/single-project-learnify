import React, { useState } from 'react';
import { 
  Send, 
  Users, 
  MessageCircle, 
  Play, 
  Mic, 
  Video, 
  Settings, 
  X, 
  Smile, 
  Paperclip,
  ShieldCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const LiveRoom = () => {
  const [chatMessage, setChatMessage] = useState('');
  
 

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Video Stream Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden relative border border-slate-800 shadow-2xl group">
          {/* Main Stream (Placeholder) */}
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-60" alt="Live Stream" />
          
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg animate-pulse">Live</span>
                <span className="px-3 py-1.5 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 border border-white/10">
                  <Users size={12} /> 2,450 Watching
                </span>
              </div>
              <button className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <Settings size={20} />
              </button>
            </div>
            
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                <Play size={32} fill="currentColor" className="ml-1" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                  <Mic size={20} />
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                  <Video size={20} />
                </div>
              </div>
              <button className="p-3 bg-white/10 backdrop-blur-md text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stream Info */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 leading-tight">Mastering Advanced React 19 Design Patterns</h1>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Users size={16} /> Prof. Sarah Jenkins</span>
              <span className="flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-widest text-[10px]">Part 3 of 5</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-500" /> Secure Session</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Panel */}
      <aside className="w-full lg:w-96 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <MessageCircle size={20} />
            </div>
            <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">Live Discussion</h3>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </header>

        {/* Pinned Message */}
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-start gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <ShieldCheck size={14} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Instructor Pinned</p>
            <p className="text-xs text-blue-900 font-medium leading-relaxed">
              Welcome everyone! Feel free to drop your doubts here. I'll take a Q&A session at the end.
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        </div>

        {/* Chat Input */}
        <footer className="p-6 border-t border-slate-100 bg-white">
          <div className="p-3 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-center gap-3 shadow-inner">
            <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-all">
              <Smile size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Send a message..." 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700"
            />
            <button className={`p-2 rounded-xl transition-all ${
              chatMessage.trim() ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-300'
            }`}>
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default LiveRoom;
