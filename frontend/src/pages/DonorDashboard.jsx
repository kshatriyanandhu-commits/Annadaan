import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donationApi } from '../api/client';
import FoodCard from '../components/FoodCard';
import StatBadge from '../components/StatBadge';
import Toast from '../components/Toast';
import {
  PlusCircle,
  Package,
  CheckCircle2,
  Clock,
  X,
  UtensilsCrossed,
  Filter,
  RefreshCw,
  Building,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

const imagePresets = [
  {
    name: 'Veg Curry & Rice',
    type: 'Veg',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Buffet Biryani Feast',
    type: 'Veg',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Artisan Bakery',
    type: 'Baked',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pantry Grains & Dal',
    type: 'Raw/Grocery',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Chicken Roast & Rice',
    type: 'Non-Veg',
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pastries & Breads',
    type: 'Baked',
    url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
  },
];

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const defaultCookedTime = new Date().toISOString().slice(0, 16);
  const [formData, setFormData] = useState({
    title: '',
    foodType: 'Veg',
    quantity: '',
    cookedTime: defaultCookedTime,
    expiryHours: 6,
    pickupAddress: user?.address || '',
    city: user?.city || '',
    notes: '',
    imageUrl: imagePresets[0].url,
  });

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const res = await donationApi.getMyDonations();
      setDonations(res.data?.donations || []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch donations' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
    if (user) {
      setFormData((prev) => ({
        ...prev,
        pickupAddress: prev.pickupAddress || user.address || '',
        city: prev.city || user.city || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingDonation(null);
    setFormData({
      title: '',
      foodType: 'Veg',
      quantity: '',
      cookedTime: new Date().toISOString().slice(0, 16),
      expiryHours: 6,
      pickupAddress: user?.address || '',
      city: user?.city || '',
      notes: '',
      imageUrl: imagePresets[0].url,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setFormData({
      title: donation.title,
      foodType: donation.foodType,
      quantity: donation.quantity,
      cookedTime: donation.cookedTime
        ? new Date(donation.cookedTime).toISOString().slice(0, 16)
        : defaultCookedTime,
      expiryHours: donation.expiryHours,
      pickupAddress: donation.pickupAddress,
      city: donation.city,
      notes: donation.notes || '',
      imageUrl: donation.imageUrl || imagePresets[0].url,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (editingDonation) {
        await donationApi.update(editingDonation._id, formData);
        setToast({ type: 'success', title: 'Listing Updated', message: 'Your surplus food listing details have been updated.' });
      } else {
        await donationApi.create(formData);
        setToast({
          type: 'success',
          title: 'Food Listing Published!',
          message: 'Surplus food listing is live! Verified local NGOs are being notified for immediate pickup.',
        });
      }

      setIsModalOpen(false);
      fetchMyDonations();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel or remove this food listing?')) return;
    try {
      setActionLoading(id);
      await donationApi.delete(id);
      setToast({ type: 'info', message: 'Donation listing removed/cancelled' });
      fetchMyDonations();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete listing' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    try {
      setActionLoading(id);
      await donationApi.complete(id);
      setToast({
        type: 'success',
        title: 'Rescue Handover Confirmed!',
        message: 'Food handover confirmed! Rescued status recorded in community impact.',
      });
      fetchMyDonations();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to complete donation' });
    } finally {
      setActionLoading(null);
    }
  };

  const totalCount = donations.length;
  const availableCount = donations.filter((d) => d.status === 'Available').length;
  const claimedCount = donations.filter((d) => d.status === 'Claimed').length;
  const completedCount = donations.filter((d) => d.status === 'Completed').length;

  const filteredDonations =
    filterStatus === 'All'
      ? donations
      : donations.filter((d) => d.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <UtensilsCrossed size={14} />
            <span>Commercial Food Donor Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {user?.organization || user?.name}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage your surplus listings, monitor live pickup claims by NGOs, and log completed rescues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMyDonations}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-800 transition"
            title="Refresh List"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm transition shadow-glow-emerald flex items-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Post Surplus Food Listing</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge
          icon={Package}
          label="Total Listed"
          value={totalCount}
          subtitle="All recorded food packages"
          color="teal"
        />
        <StatBadge
          icon={Clock}
          label="Currently Available"
          value={availableCount}
          subtitle="Waiting for NGO reservation"
          color="emerald"
        />
        <StatBadge
          icon={Building}
          label="Claimed by NGOs"
          value={claimedCount}
          subtitle="Pickup scheduled or in transit"
          color="amber"
        />
        <StatBadge
          icon={CheckCircle2}
          label="Rescued & Delivered"
          value={completedCount}
          subtitle="Safely reached hungry shelters"
          color="sky"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <h2 className="text-xl font-bold text-white">My Food Listings</h2>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
            {filteredDonations.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          {['All', 'Available', 'Claimed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Loading your food listings...</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border">
          <Package size={42} className="mx-auto text-slate-500 mb-3" />
          <h3 className="text-lg font-bold text-white">No food listings found</h3>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            {filterStatus === 'All'
              ? 'You have not listed any surplus food yet. Share meals with community shelters now!'
              : `You have no listings marked as '${filterStatus}'.`}
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-glow-emerald"
          >
            Post Surplus Food Now
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((item) => (
            <FoodCard
              key={item._id}
              donation={item}
              currentUserId={user?._id}
              userRole="donor"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
              isCompleting={actionLoading === item._id}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingDonation ? 'Edit Food Listing' : 'Post Surplus Food Donation'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Provide exact food details to ensure safe, expedited NGO rescue
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Food Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Leftover Wedding Buffet Biryani & Curries"
                  required
                  className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-emerald-400" />
                  Select Food Cover Photo Preset or Enter URL
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition ${
                        formData.imageUrl === preset.url
                          ? 'border-emerald-400 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {formData.imageUrl === preset.url && (
                        <div className="absolute inset-0 bg-emerald-950/50 flex items-center justify-center text-emerald-400">
                          <Check size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Or paste direct image URL (https://...)"
                  className="w-full glass-input text-white px-4 py-2 rounded-xl text-xs placeholder:text-slate-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Food Category *
                  </label>
                  <select
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleInputChange}
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm bg-slate-900"
                  >
                    <option value="Veg">Veg (Pure Vegetarian)</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Raw/Grocery">Raw / Grocery Staples</option>
                    <option value="Baked">Baked Goods / Bread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Quantity Description *
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 50 Servings / 25 Kg"
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preparation / Cooked Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="cookedTime"
                    value={formData.cookedTime}
                    onChange={handleInputChange}
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Safe Consumption Window (Hours) *
                  </label>
                  <input
                    type="number"
                    name="expiryHours"
                    min="1"
                    max="72"
                    value={formData.expiryHours}
                    onChange={handleInputChange}
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Pickup Address *
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleInputChange}
                    placeholder="Kitchen entry, Door 12, Main St"
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Tenali"
                    required
                    className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Handling / Reheating Notes & Allergens (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="e.g. Packed in stainless steel containers; contains nuts; keep warm until served."
                  className="w-full glass-input text-white px-4 py-2.5 rounded-xl text-sm placeholder:text-slate-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition shadow-glow-emerald disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>{editingDonation ? 'Save Updates' : 'Publish Donation Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default DonorDashboard;
