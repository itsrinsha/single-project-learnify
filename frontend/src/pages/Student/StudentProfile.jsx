import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  GraduationCap, 
  Edit3, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Camera,
  MapPin,
  Calendar,
  Settings,
  ChevronRight,
  Shield,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { fetchProfile, updateProfile, clearState } from '../../features/auth/authSlice';
import { fetchStudentDashboard } from '../../features/student/studentThunk';
import { uploadUserAvatar } from '../../services/userService';
import { toast } from 'react-hot-toast';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const { dashboardData } = useSelector((state) => state.student);
  
  const fileInputRef = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
  });

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchStudentDashboard());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (success && isEditing) {
      setIsEditing(false);
      dispatch(clearState());
    }
  }, [success, isEditing, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    dispatch(updateProfile(formData));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    try {
      setAvatarLoading(true);
      const res = await uploadUserAvatar(file);
      if (res && res.url) {
        await dispatch(updateProfile({ profileImage: res.url })).unwrap();
        toast.success("Profile picture updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile picture");
    } finally {
      setAvatarLoading(false);
    }
  };

  const stats = [
    { label: 'Courses Enrolled', value: dashboardData?.totalCourses || 0, icon: <BookOpen className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Completed', value: dashboardData?.completedCourses || 0, icon: <CheckCircle2 className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pending', value: dashboardData?.pendingCourses || 0, icon: <Clock className="text-yellow-600" />, bg: 'bg-yellow-50' },
    { label: 'Certificates', value: 0, icon: <Award className="text-purple-600" />, bg: 'bg-purple-50' },
  ];

  const DefaultAvatar = () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
      <UserIcon size={48} />
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => dispatch(clearState())}><X size={18} /></button>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Left Column: Profile Card */}
        <div className="xl:w-96 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="h-32 bg-blue-600"></div>
            <div className="px-8 pb-8 flex flex-col items-center -mt-16 text-center">
              <div className="relative group overflow-hidden w-32 h-32 rounded-[2rem] border-4 border-white shadow-xl">
                {avatarLoading ? (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : user?.profileImage ? (
                  <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
                <button 
                  onClick={handleAvatarClick}
                  disabled={avatarLoading}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all disabled:cursor-not-allowed"
                >
                  <Camera size={24} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              
              <div className="mt-6 space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium">
                  <MapPin size={14} />
                  <span className="text-xs">{user?.location || 'Location not set'}</span>
                </div>
              </div>

              <div className="w-full mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                  <p className="text-sm font-bold text-slate-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-1">
                    <Shield size={12} /> Active
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-100"
              >
                <Edit3 size={18} />
                Edit My Profile
              </button>
            </div>
          </div>


        </div>

        {/* Right Column: Stats & Information */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center md:items-start">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {isEditing ? (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Edit Profile Information</h3>
                <button onClick={handleCancel} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><X size={24} /></button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bio / About</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. New York, USA"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t border-slate-100">
                <button onClick={handleCancel} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold">Cancel</button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-blue-400"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">Bio / About</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  {user?.bio || 'You haven\'t added a bio yet. Click edit to tell your instructors and fellow students about yourself.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-10 mt-6">
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><Mail size={22} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                        <p className="text-base font-bold text-slate-900">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><Phone size={22} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-base font-bold text-slate-900">{user?.phone || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={22} /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-base font-bold text-slate-900">{user?.location || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
