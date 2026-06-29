import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import adminService from '../../services/adminService';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllOffers();
      setOffers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      setError('Could not load offers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await adminService.deleteOffer(id);
      fetchOffers();
    } catch (err) {
      alert('Failed to delete offer');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading promotional offers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Offer Management</h2>
          <p className="text-slate-500">Create and monitor discounts and promotional campaigns.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
          <Plus className="w-5 h-5" /> Create New Offer
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={fetchOffers} className="ml-auto text-xs bg-white px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {offers.length > 0 ? offers.map((offer) => (
          <div key={offer._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex group">
            {/* Discount Side */}
            <div className={`w-32 sm:w-40 flex flex-col items-center justify-center text-white shrink-0 p-4 relative overflow-hidden ${
              offer.status === 'active' ? 'bg-blue-600' : 
              offer.status === 'scheduled' ? 'bg-amber-500' : 'bg-slate-400'
            }`}>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <Tag className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-3xl font-black">{offer.discountPercentage}%</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">Discount</span>
            </div>

            {/* Content Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{offer.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-600 uppercase tracking-tighter">
                      CODE: {offer.code}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Created At</p>
                    <p className="font-semibold">{new Date(offer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Valid Until</p>
                    <p className="font-semibold">{new Date(offer.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> 0 <span className="text-slate-400 font-medium">Used</span>
                   </div>
                   <StatusBadge status={offer.status === 'active' ? 'Active' : offer.status === 'expired' ? 'Expired' : 'Scheduled'} />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                  <button 
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No active offers</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
