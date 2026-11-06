import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsApi, donationApi } from '../api/client';
import FoodCard from '../components/FoodCard';
import StatBadge from '../components/StatBadge';
import Card3DTilt from '../components/Card3DTilt';
import EarthRescueCanvas3D from '../components/EarthRescueCanvas3D';
import Toast from '../components/Toast';
import {
  Utensils,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Leaf,
  Clock,
  Building2,
  Users,
  CheckCircle,
  Compass,
} from 'lucide-react';

const categorySpotlights = [
  {
    name: 'Vegetarian Meals',
    type: 'Veg',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh banquet curries, dal, paneer specialties & steamed rice.',
    tag: 'Highest Demand',
  },
  {
    name: 'Artisan Bakery',
    type: 'Baked',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: 'Buns, dinner rolls, sandwich loaves & breakfast pastries.',
    tag: 'Quick Delivery',
  },
  {
    name: 'Raw Groceries & Staples',
    type: 'Raw/Grocery',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    description: 'Sealed rice, lentils, wheat flour bags & fresh farm vegetables.',
    tag: 'Long Shelf-Life',
  },
  {
    name: 'Savory & Protein',
    type: 'Non-Veg',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    description: 'Thermal-contained barbecue, roast feasts & biryanis.',
    tag: 'Urgent Care',
  },
];

const Home = () => {
  const { isAuthenticated, isDonor, isNGO } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadPlatformData = async () => {
      try {
        const [statsRes, donationsRes] = await Promise.allSettled([
          statsApi.getSummary(),
          donationApi.getFeed({ status: 'Available' }),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data?.stats);
        }

        if (donationsRes.status === 'fulfilled') {
          setRecentDonations(donationsRes.value.data?.donations?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('[Home] Error fetching platform data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlatformData();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      <section className="relative pt-8 sm:pt-16 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <Leaf size={14} className="text-emerald-400" />
              <span>Smart Waste Food Management & Realtime Rescue</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Rescue Surplus Meals.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                Nourish Communities.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Annadaan connects restaurants, banquet caterers, and food businesses directly with
              verified hunger shelters in minutes with automated freshness decay timers.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to={isAuthenticated ? (isDonor ? '/donor' : '/ngo') : '/register?role=donor'}
                className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-glow-emerald flex items-center gap-2.5 hover:-translate-y-0.5"
              >
                <Utensils size={18} />
                <span>Donate Surplus Food</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/ngo"
                className="px-6 py-3.5 glass-panel hover:bg-slate-800/80 text-slate-200 rounded-2xl font-semibold text-sm sm:text-base transition-all border border-slate-700/80 flex items-center gap-2.5 hover:-translate-y-0.5"
              >
                <HeartHandshake size={18} className="text-teal-400" />
                <span>Explore Live NGO Feed</span>
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" />
                <span>Zero Landfill Wastage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-teal-400" />
                <span>100% Verified Community Shelters</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400" />
                <span>Dynamic Freshness Countdown</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] relative">
              <EarthRescueCanvas3D className="w-full h-full rounded-full" />

              <div className="absolute -top-3 -left-3 sm:-left-6 glass-panel p-3.5 rounded-2xl border border-emerald-500/30 shadow-xl backdrop-blur-xl animate-floatSlow">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Meals Rescued</p>
                    <p className="text-sm font-extrabold text-white">
                      {stats?.estimatedMealsRescued?.toLocaleString() || '1,420+'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 sm:-right-4 glass-panel p-3.5 rounded-2xl border border-teal-500/30 shadow-xl backdrop-blur-xl animate-floatDelayed">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Leaf size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Carbon Diverted</p>
                    <p className="text-sm font-extrabold text-teal-300">
                      {stats?.co2SavedKg?.toLocaleString() || '1,775'} kg CO₂e
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBadge
            icon={TrendingUp}
            label="Meals Rescued"
            value={stats?.estimatedMealsRescued || '1,420+'}
            subtitle="Diverted from landfills directly to shelters"
            color="emerald"
            trend="Live"
          />
          <StatBadge
            icon={Utensils}
            label="Active Listings"
            value={stats?.activeAvailable ?? '18'}
            subtitle="Ready for pickup across verified cities"
            color="teal"
            trend="Realtime"
          />
          <StatBadge
            icon={Building2}
            label="Partner Donors"
            value={stats?.registeredDonors || '45+'}
            subtitle="Restaurants, banquet halls & households"
            color="sky"
          />
          <StatBadge
            icon={Users}
            label="Verified NGOs"
            value={stats?.registeredNGOs || '28+'}
            subtitle="Community kitchens and rescue volunteers"
            color="amber"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Compass size={14} />
              <span>Surplus Food Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Food Ready For Real-Time Rescue
            </h2>
          </div>
          <Link
            to="/ngo"
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
          >
            <span>Explore all categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categorySpotlights.map((cat) => (
            <Card3DTilt key={cat.name} maxTilt={10}>
              <Link
                to={`/ngo?foodType=${encodeURIComponent(cat.type)}`}
                className="glass-panel rounded-3xl border border-slate-800/80 hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between group transition-all duration-300 block h-full"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/90 text-slate-950 shadow-md">
                    {cat.tag}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>Browse Feed</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </Card3DTilt>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Available Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Food Waiting For Immediate Collection
            </h2>
          </div>
          <Link
            to="/ngo"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <span>View All Listings</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {recentDonations.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border">
            <Utensils className="mx-auto text-emerald-400 mb-3" size={38} />
            <h3 className="text-lg font-bold text-white">All surplus meals rescued!</h3>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Are you a restaurant or caterer with surplus meals? List them now to feed families!
            </p>
            <Link
              to="/donor"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition"
            >
              Post Food Listing
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDonations.map((item) => (
              <FoodCard
                key={item._id}
                donation={item}
                userRole={isNGO ? 'ngo' : isDonor ? 'donor' : null}
              />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Sustainability & Carbon Reduction
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4 leading-tight">
              Food waste generates 8-10% of global greenhouse emissions.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              When edible food decomposes in landfills, it emits potent methane gas. Every portion
              rescued through Annadaan not only nourishes a person in need but prevents approx 2.5 kg of
              carbon equivalents from entering our atmosphere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/impact"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition shadow-glow-emerald"
              >
                Explore Live Environmental Impact
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition"
              >
                Register Your Food Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default Home;
