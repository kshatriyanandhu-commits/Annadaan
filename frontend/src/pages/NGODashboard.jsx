import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationApi } from '../api/client';
import FoodCard from '../components/FoodCard';
import StatBadge from '../components/StatBadge';
import Toast from '../components/Toast';
import {
  HeartHandshake,
  Search,
  MapPin,
  RefreshCw,
  X,
  Package,
  Sparkles,
} from 'lucide-react';

const NGODashboard = () => {
  const { user, isNGO } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('foodType') || 'All';

  const [activeTab, setActiveTab] = useState('available');
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const [selectedFoodType, setSelectedFoodType] = useState(initialCategory);
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const typeFromUrl = searchParams.get('foodType');
    if (typeFromUrl) {
      setSelectedFoodType(typeFromUrl);
    }
  }, [searchParams]);

  const fetchAvailable = async () => {
    try {
      setLoading(true);
      const params = {
        status: 'Available',
      };
      if (selectedFoodType !== 'All') params.foodType = selectedFoodType;
      if (searchCity.trim()) params.city = searchCity.trim();
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await donationApi.getFeed(params);
      setAvailableDonations(res.data?.donations || []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch available donations' });
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    if (!isNGO) return;
    try {
      setLoading(true);
      const res = await donationApi.getMyClaims();
      setMyClaims(res.data?.donations || []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch claimed pickups' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailable();
    } else {
      fetchClaims();
    }
  }, [activeTab, selectedFoodType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'available') {
      fetchAvailable();
    }
  };

  const handleClaim = async (donationId) => {
    if (!isNGO) {
      setToast({
        type: 'error',
        title: 'NGO Account Required',
        message: 'Please sign in or register with an NGO / Food Shelter account to claim surplus food.',
      });
      return;
    }

    try {
      setActionLoading(donationId);
      await donationApi.claim(donationId);

      setToast({
        type: 'success',
        title: 'Food Reserved!',
        message: 'Food package reserved! View in "My Claimed Pickups" to access full pickup location & donor phone.',
      });

      fetchAvailable();
      if (activeTab === 'claims') {
        fetchClaims();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to claim food' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (donationId) => {
    try {
      setActionLoading(donationId);
      await donationApi.complete(donationId);

      setToast({
        type: 'success',
        title: 'Mission Complete!',
        message: 'Food receipt verified! Rescued status recorded in public impact telemetry.',
      });

      fetchClaims();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to complete rescue' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
            <HeartHandshake size={14} />
            <span>NGO Food Rescue Operations Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isNGO
              ? `${user?.organization || user?.name} Rescue Dispatch`
              : 'Live Surplus Food Rescue Feed'}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time surplus food matching from local caterers and restaurants with GPS pickup coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={activeTab === 'available' ? fetchAvailable : fetchClaims}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-800 transition"
            title="Refresh Feed"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('available')}
          className={`py-2.5 px-5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === 'available'
              ? 'bg-emerald-600 text-white shadow-glow-emerald'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles size={16} />
          <span>Available Food Feed</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 font-semibold">
            {availableDonations.length}
          </span>
        </button>

        {isNGO && (
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-2.5 px-5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'bg-teal-600 text-white shadow-glow-teal'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <HeartHandshake size={16} />
            <span>My Claimed Pickups</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 font-semibold">
              {myClaims.length}
            </span>
          </button>
        )}
      </div>

      {activeTab === 'available' && (
        <div className="glass-panel p-4 rounded-2xl border space-y-3">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <div className="sm:col-span-5 relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food item (e.g. Biryani, Bread, Rice)..."
                className="w-full glass-input text-white pl-10 pr-4 py-2 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Filter by City (e.g. Tenali, Guntur)..."
                className="w-full glass-input text-white pl-10 pr-4 py-2 rounded-xl text-sm placeholder:text-slate-500"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition shadow-glow-emerald"
              >
                Apply Filter
              </button>
              {(searchQuery || searchCity || selectedFoodType !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchCity('');
                    setSelectedFoodType('All');
                    setTimeout(fetchAvailable, 50);
                  }}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl transition"
                  title="Clear Filters"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Food Category:</span>
            {['All', 'Veg', 'Non-Veg', 'Raw/Grocery', 'Baked'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedFoodType(type)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedFoodType === type
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-3" />
          <p className="text-slate-400 text-sm">Searching active listings...</p>
        </div>
      ) : activeTab === 'available' ? (
        availableDonations.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border">
            <Package size={42} className="mx-auto text-slate-500 mb-3" />
            <h3 className="text-lg font-bold text-white">No available food listings match your criteria</h3>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Try adjusting your city filter or food category to see more community donations.
            </p>
            <button
              onClick={() => {
                setSearchCity('');
                setSearchQuery('');
                setSelectedFoodType('All');
                setTimeout(fetchAvailable, 50);
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDonations.map((item) => (
              <FoodCard
                key={item._id}
                donation={item}
                currentUserId={user?._id}
                userRole={isNGO ? 'ngo' : null}
                onClaim={handleClaim}
                isClaiming={actionLoading === item._id}
              />
            ))}
          </div>
        )
      ) : (
        myClaims.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border">
            <HeartHandshake size={42} className="mx-auto text-teal-400 mb-3" />
            <h3 className="text-lg font-bold text-white">No active pickups claimed</h3>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Head to the Available Food Feed and reserve surplus meals ready for collection!
            </p>
            <button
              onClick={() => setActiveTab('available')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition shadow-glow-teal"
            >
              Browse Available Food
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myClaims.map((item) => (
              <FoodCard
                key={item._id}
                donation={item}
                currentUserId={user?._id}
                userRole="ngo"
                onComplete={handleComplete}
                isCompleting={actionLoading === item._id}
              />
            ))}
          </div>
        )
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default NGODashboard;
