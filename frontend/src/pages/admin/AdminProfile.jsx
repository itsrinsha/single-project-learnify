import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Settings, 
  Lock, 
  Bell, 
  Smartphone,
  CheckCircle2,
  Edit2,
  Camera,
  Save,
  X,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { fetchProfile, updateProfile } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';
import { uploadUserAvatar } from '../../services/userService';

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateProfile(formData));
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

  const DefaultAvatar = () => (
    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-black text-4xl">
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Profile</h2>
        <p className="text-slate-500">Manage your administrative account settings.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover & Avatar */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
           <div className="absolute -bottom-16 left-8 p-1.5 bg-white rounded-[2.5rem] shadow-2xl">
              <div className="relative group overflow-hidden w-32 h-32 rounded-[2rem]">
                {avatarLoading ? (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                  </div>
                ) : user?.profileImage ? (
                  <img src={user.profileImage} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <DefaultAvatar />
                )}
                <button 
                  onClick={handleAvatarClick}
                  disabled={avatarLoading}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer disabled:cursor-not-allowed"
                >
                  <Camera className="w-8 h-8" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
           </div>
        </div>

        <div className="pt-20 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h3 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              {user?.name} <CheckCircle2 className="w-6 h-6 text-blue-500" />
            </h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Platform Super Administrator</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 rounded-2xl font-bold text-white hover:bg-blue-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-8 py-3.5 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:bg-blue-400"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Personal Information</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <UserIcon className="w-5 h-5 text-slate-400" />
                  {isEditing ? (
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-slate-700"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{user?.name}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail className="w-5 h-5 text-slate-400" />
                  {isEditing ? (
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-slate-700"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  {isEditing ? (
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-transparent border-none outline-none w-full font-bold text-slate-700"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{user?.phone || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security & Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-blue-600 transition-all">
                    <Lock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Change Password</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Secure your account</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-blue-600 transition-all">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Two-Factor Auth</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase mt-0.5">Enabled</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
