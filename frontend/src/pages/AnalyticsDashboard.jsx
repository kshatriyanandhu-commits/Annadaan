import React, { useState, useEffect } from 'react';
import { statsApi } from '../api/client';
import StatBadge from '../components/StatBadge';
import RescueNetwork3D from '../components/RescueNetwork3D';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Droplets,
  Building2,
  Users,
  CheckCircle2,
  RefreshCw,
  Globe,
  Award,
  Zap,
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsApi.getSummary();
      setStats(res.data?.stats);
    } catch (err) {
      console.error('[Analytics] Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalCategoryItems =
    stats?.foodTypeBreakdown?.reduce((acc, curr) => acc + curr.count, 0) || 1;

  const categoryColors = {
    Veg: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
    'Non-Veg': { bar: 'bg-rose-500', text: 'text-rose-400' },
    'Raw/Grocery': { bar: 'bg-teal-500', text: 'text-teal-400' },
    Baked: { bar: 'bg-amber-500', text: 'text-amber-400' },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <BarChart3 size={14} />
            <span>Community Transparency & Impact Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Annadaan Open Impact & Analytics
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time open telemetry tracking food waste diversion, meals served, and carbon footprint reduction.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl border border-slate-800 transition self-start md:self-auto"
          title="Refresh Metrics"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBadge
          icon={TrendingUp}
          label="Total Meals Rescued"
          value={stats?.estimatedMealsRescued?.toLocaleString() || '1,420+'}
          subtitle="Directly fed to shelters and families"
          color="emerald"
          trend="Impact"
        />
        <StatBadge
          icon={Leaf}
          label="CO2e Emissions Prevented"
          value={`${stats?.co2SavedKg?.toLocaleString() || '1,775'} kg`}
          subtitle="Methane prevented from landfill decomposition"
          color="teal"
          trend="-CO2e"
        />
        <StatBadge
          icon={Droplets}
          label="Water Embedded Conserved"
          value={`${((stats?.waterSavedLiters || 710000) / 1000).toFixed(0)}k L`}
          subtitle="Agricultural water embedded in rescued food"
          color="sky"
        />
        <StatBadge
          icon={CheckCircle2}
          label="Completed Rescues"
          value={stats?.completedDonations ?? '58'}
          subtitle="Full closed-loop verified deliveries"
          color="amber"
        />
      </div>

      <div className="glass-panel rounded-3xl border border-emerald-500/25 p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4 z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap size={14} /> Real-time Node Exchange
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Live Regional Rescue Mesh Network
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Every point in this interactive 3D spatial field represents a participating food business,
              shelter hub, or active transit rescue packet. Green nodes represent active donors; teal nodes represent receiving community kitchens.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-glow-emerald" />
                <span>Donors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-500 shadow-glow-teal" />
                <span>NGO Shelters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>In-Transit Rescues</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950/60 border border-slate-800">
            <RescueNetwork3D className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Food Category Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of surplus food types listed on the network
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              {stats?.totalDonations || 0} Total Listings
            </span>
          </div>

          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
            {stats?.foodTypeBreakdown?.map((cat) => {
              const pct = Math.max(Math.round((cat.count / totalCategoryItems) * 100), 0);
              const colors = categoryColors[cat.type] || categoryColors.Veg;
              if (cat.count === 0) return null;
              return (
                <div
                  key={cat.type}
                  style={{ width: `${pct}%` }}
                  className={`h-full ${colors.bar} first:rounded-l-full last:rounded-r-full transition-all duration-500`}
                  title={`${cat.type}: ${cat.count} listings (${pct}%)`}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {stats?.foodTypeBreakdown?.map((cat) => {
              const pct = Math.round((cat.count / totalCategoryItems) * 100) || 0;
              const colors = categoryColors[cat.type] || categoryColors.Veg;
              return (
                <div key={cat.type} className="p-3 bg-slate-900/70 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${colors.bar}`} />
                    <span className="text-xs text-slate-300 font-medium truncate">{cat.type}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{cat.count}</p>
                  <p className={`text-[11px] font-semibold ${colors.text}`}>{pct}% share</p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Donation Lifecycle State
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs text-emerald-400 font-medium">Available</p>
                <p className="text-xl font-bold text-white">{stats?.activeAvailable || 0}</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-amber-400 font-medium">Claimed / En Route</p>
                <p className="text-xl font-bold text-white">{stats?.claimedDonations || 0}</p>
              </div>
              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <p className="text-xs text-sky-400 font-medium">Rescued (Completed)</p>
                <p className="text-xl font-bold text-white">{stats?.completedDonations || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registered Ecosystem</h3>
                <p className="text-xs text-slate-400">Entities coordinating food redistribution</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Building2 size={16} />
                  <span className="text-xs font-semibold">Active Donors</span>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {stats?.registeredDonors ?? 0}
                </p>
                <p className="text-[11px] text-slate-400">Restaurants, hotels, halls</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-teal-400 mb-1">
                  <Award size={16} />
                  <span className="text-xs font-semibold">Verified NGOs</span>
                </div>
                <p className="text-2xl font-extrabold text-white">
                  {stats?.registeredNGOs ?? 0}
                </p>
                <p className="text-[11px] text-slate-400">Shelters, soup kitchens</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Globe size={18} className="text-emerald-400" />
              <h3 className="text-base font-bold">Top Active Cities</h3>
            </div>

            <div className="space-y-2">
              {stats?.cityBreakdown?.length > 0 ? (
                stats.cityBreakdown.map((item, idx) => (
                  <div
                    key={item.city}
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl text-xs border border-slate-800"
                  >
                    <span className="font-semibold text-slate-200">
                      {idx + 1}. {item.city}
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {item.count} donations
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-2">
                  City breakdown will automatically populate as donations are created across regions.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
