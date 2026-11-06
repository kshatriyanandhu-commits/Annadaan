import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Package,
  Calendar,
  AlertTriangle,
  Phone,
  Building,
  CheckCircle2,
  HandHeart,
  Navigation,
  ShieldCheck,
} from 'lucide-react';

const FoodDetailModal = ({
  donation,
  isOpen,
  onClose,
  onClaim,
  onComplete,
  userRole,
  currentUserId,
  isClaiming,
  isCompleting,
}) => {
  if (!isOpen || !donation) return null;

  const donor = donation.donor || {};
  const claimer = donation.claimedBy || {};

  const isOwner =
    currentUserId &&
    (donor._id === currentUserId || donation.donor === currentUserId);
  const isClaimer =
    currentUserId &&
    (claimer._id === currentUserId || donation.claimedBy === currentUserId);

  const defaultImages = {
    Veg: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    'Non-Veg': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80',
    'Raw/Grocery': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80',
    Baked: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
  };

  const displayImage =
    donation.imageUrl || defaultImages[donation.foodType] || defaultImages.Veg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white transition backdrop-blur-md border border-slate-700/50 shadow-lg"
        >
          <X size={18} />
        </button>

        <div className="relative h-60 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={displayImage}
            alt={donation.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-emerald-500/90 text-slate-950 shadow-md">
                {donation.foodType}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-900/85 text-slate-200 border border-slate-700/60 backdrop-blur-md">
                Status: {donation.status}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-xl backdrop-blur-md font-medium">
              <Clock size={13} />
              <span>Safe Window: {donation.expiryHours} Hours</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {donation.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Package size={15} className="text-emerald-400" />
                <strong className="text-white font-semibold">Quantity:</strong> {donation.quantity}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <Calendar size={15} className="text-teal-400" />
                <strong className="text-white font-semibold">Cooked:</strong>{' '}
                {donation.cookedTime
                  ? new Date(donation.cookedTime).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Pickup Location
                </p>
                <p className="text-sm font-bold text-white capitalize">
                  {donation.city} — {donation.pickupAddress}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Navigation size={12} className="text-emerald-400" />
                  Estimated collection radius: 2-8 km
                </p>
              </div>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${donation.pickupAddress}, ${donation.city}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Navigation size={14} className="text-emerald-400" />
              <span>Open in Google Maps</span>
            </a>
          </div>

          {donation.notes && (
            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/80">
              <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-teal-400" />
                Preparation & Allergen Guidelines
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {donation.notes}
              </p>
            </div>
          )}

          <div className="p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                {(donor.organization || donor.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">
                    {donor.organization || donor.name || 'Community Food Donor'}
                  </h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-semibold">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {donor.organization ? `Representative: ${donor.name}` : 'Individual Caterer'}
                </p>
              </div>
            </div>

            {donor.phone && (
              <a
                href={`tel:${donor.phone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-glow-emerald"
              >
                <Phone size={14} />
                <span>Call {donor.phone}</span>
              </a>
            )}
          </div>

          {donation.status === 'Claimed' && claimer.name && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-xs">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <HandHeart size={15} /> Currently Claimed by Registered NGO:
              </p>
              <p className="text-slate-200 mt-1">
                <strong className="text-white">{claimer.organization || claimer.name}</strong>{' '}
                {claimer.phone && `(${claimer.phone})`}
              </p>
              <p className="text-slate-400 text-[11px] mt-1">
                Volunteer team is en route. Please ensure food packages are staged near the pickup entrance.
              </p>
            </div>
          )}
        </div>

        <div className="p-5 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
          >
            Close
          </button>

          {userRole === 'ngo' && donation.status === 'Available' && (
            <button
              onClick={() => {
                onClaim && onClaim(donation._id);
                onClose();
              }}
              disabled={isClaiming}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition shadow-glow-emerald flex items-center gap-2 disabled:opacity-50"
            >
              <HandHeart size={16} />
              <span>{isClaiming ? 'Reserving...' : 'Claim This Food for Shelter'}</span>
            </button>
          )}

          {donation.status === 'Claimed' && (isOwner || isClaimer || userRole === 'admin') && (
            <button
              onClick={() => {
                onComplete && onComplete(donation._id);
                onClose();
              }}
              disabled={isCompleting}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              <span>{isCompleting ? 'Confirming...' : 'Mark Food Received & Completed'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
