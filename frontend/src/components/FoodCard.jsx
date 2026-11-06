import React, { useState, useEffect } from 'react';
import Card3DTilt from './Card3DTilt';
import FoodDetailModal from './FoodDetailModal';
import {
  Clock,
  MapPin,
  Package,
  Calendar,
  AlertTriangle,
  Phone,
  CheckCircle2,
  HandHeart,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
} from 'lucide-react';

const foodTypeStyles = {
  Veg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  'Non-Veg': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  'Raw/Grocery': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  Baked: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
};

const statusStyles = {
  Available: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Claimed: 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse',
  Completed: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Cancelled: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
};

const defaultImages = {
  Veg: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Non-Veg': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'Raw/Grocery': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  Baked: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
};

const FoodCard = ({
  donation,
  currentUserId,
  userRole,
  onClaim,
  onComplete,
  onEdit,
  onDelete,
  isClaiming = false,
  isCompleting = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, expired: false, formatted: '' });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!donation?.cookedTime || !donation?.expiryHours) return;

      const cooked = new Date(donation.cookedTime).getTime();
      const expiresAt = cooked + donation.expiryHours * 60 * 60 * 1000;
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, expired: true, formatted: 'Expired' });
        return;
      }

      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      let formatted = '';
      if (hours > 0) {
        formatted = `${hours}h ${minutes}m left`;
      } else {
        formatted = `${minutes}m left (Urgent)`;
      }

      setTimeLeft({ hours, minutes, expired: false, formatted });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [donation]);

  const donor = donation.donor || {};
  const claimer = donation.claimedBy || {};

  const isOwner =
    currentUserId &&
    (donor._id === currentUserId || donation.donor === currentUserId);
  const isClaimer =
    currentUserId &&
    (claimer._id === currentUserId || donation.claimedBy === currentUserId);

  const displayImage =
    donation.imageUrl || defaultImages[donation.foodType] || defaultImages.Veg;

  const getUrgencyBadge = () => {
    if (donation.status === 'Completed') {
      return (
        <span className="flex items-center gap-1 text-[11px] text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-lg border border-sky-800/60 font-semibold backdrop-blur-md">
          <CheckCircle2 size={12} /> Rescued
        </span>
      );
    }
    if (donation.status === 'Cancelled') {
      return (
        <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-700/60 backdrop-blur-md">
          Cancelled
        </span>
      );
    }
    if (timeLeft.expired) {
      return (
        <span className="flex items-center gap-1 text-[11px] text-red-300 bg-red-950/85 px-2 py-0.5 rounded-lg border border-red-800/60 font-bold backdrop-blur-md">
          <AlertTriangle size={12} /> Expired
        </span>
      );
    }
    if (timeLeft.hours < 2) {
      return (
        <span className="flex items-center gap-1 text-[11px] text-rose-200 bg-rose-950/90 px-2.5 py-0.5 rounded-lg border border-rose-700/80 font-bold animate-pulse backdrop-blur-md">
          <Clock size={12} /> {timeLeft.formatted}
        </span>
      );
    }
    if (timeLeft.hours <= 4) {
      return (
        <span className="flex items-center gap-1 text-[11px] text-amber-200 bg-amber-950/85 px-2 py-0.5 rounded-lg border border-amber-700/60 font-semibold backdrop-blur-md">
          <Clock size={12} /> {timeLeft.formatted}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] text-emerald-200 bg-emerald-950/85 px-2 py-0.5 rounded-lg border border-emerald-700/60 font-semibold backdrop-blur-md">
        <Clock size={12} /> {timeLeft.formatted}
      </span>
    );
  };

  return (
    <>
      <Card3DTilt
        maxTilt={8}
        className="glass-panel rounded-3xl border border-slate-800/80 hover:border-emerald-500/40 hover:shadow-2xl flex flex-col justify-between overflow-hidden group transition-all duration-300"
      >
        <div>
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={displayImage}
              alt={donation.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg border backdrop-blur-md ${
                  foodTypeStyles[donation.foodType] || foodTypeStyles.Veg
                }`}
              >
                {donation.foodType}
              </span>
              <div>{getUrgencyBadge()}</div>
            </div>

            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] font-semibold transition backdrop-blur-md border border-slate-700/60 flex items-center gap-1 shadow-md opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200"
            >
              <Eye size={12} /> Quick View
            </button>
          </div>

          <div className="p-5 pb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                  statusStyles[donation.status] || statusStyles.Available
                }`}
              >
                {donation.status}
              </span>
              <span className="text-xs text-slate-400 capitalize flex items-center gap-1">
                <MapPin size={12} className="text-amber-400" />
                {donation.city}
              </span>
            </div>

            <h3
              onClick={() => setIsDetailModalOpen(true)}
              className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 cursor-pointer"
            >
              {donation.title}
            </h3>

            <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <Package size={14} className="text-emerald-400 shrink-0" />
                <span className="truncate font-semibold">{donation.quantity}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                <Calendar size={14} className="text-teal-400 shrink-0" />
                <span className="truncate">
                  {donation.cookedTime
                    ? new Date(donation.cookedTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {(donor.organization || donor.name || 'D').charAt(0).toUpperCase()}
                </div>
                <span className="truncate font-medium text-slate-300">
                  {donor.organization || donor.name || 'Verified Donor'}
                </span>
              </div>
              {donor.phone && (
                <a
                  href={`tel:${donor.phone}`}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Call Donor"
                >
                  <Phone size={12} className="text-emerald-400" />
                </a>
              )}
            </div>

            {donation.status === 'Claimed' && claimer.name && (
              <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200">
                Claimed by: <strong>{claimer.organization || claimer.name}</strong>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {userRole === 'ngo' && donation.status === 'Available' && !timeLeft.expired && (
            <button
              onClick={() => onClaim && onClaim(donation._id)}
              disabled={isClaiming}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-glow-emerald flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <HandHeart size={15} />
              <span>{isClaiming ? 'Reserving...' : 'Claim This Food'}</span>
            </button>
          )}

          {donation.status === 'Claimed' && (isOwner || isClaimer || userRole === 'admin') && (
            <button
              onClick={() => onComplete && onComplete(donation._id)}
              disabled={isCompleting}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              <span>{isCompleting ? 'Confirming...' : 'Confirm Received'}</span>
            </button>
          )}

          {isOwner && donation.status === 'Available' && (
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => onEdit && onEdit(donation)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Edit2 size={13} /> Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(donation._id)}
                className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold transition border border-rose-500/20 flex items-center justify-center gap-1"
                title="Cancel listing"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}

          {(!userRole || (userRole === 'donor' && !isOwner)) && donation.status === 'Available' && (
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="w-full text-center text-xs text-slate-300 hover:text-emerald-400 py-1.5 flex items-center justify-center gap-1 transition"
            >
              <span>View Full Food & Pickup Details</span>
              <ChevronRight size={14} className="text-emerald-400" />
            </button>
          )}

          {donation.status === 'Completed' && (
            <div className="w-full text-center text-xs text-emerald-400 font-semibold py-1 flex items-center justify-center gap-1">
              <CheckCircle2 size={14} /> Rescued & Fed to Community
            </div>
          )}
        </div>
      </Card3DTilt>

      <FoodDetailModal
        donation={donation}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onClaim={onClaim}
        onComplete={onComplete}
        userRole={userRole}
        currentUserId={currentUserId}
        isClaiming={isClaiming}
        isCompleting={isCompleting}
      />
    </>
  );
};

export default FoodCard;
