import React from 'react';

const colorThemes = {
  emerald: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  teal: {
    bg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
    iconBg: 'bg-teal-500/20 text-teal-400',
    badge: 'bg-teal-500/20 text-teal-300',
  },
  amber: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    iconBg: 'bg-amber-500/20 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  sky: {
    bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    iconBg: 'bg-sky-500/20 text-sky-400',
    badge: 'bg-sky-500/20 text-sky-300',
  },
  rose: {
    bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    iconBg: 'bg-rose-500/20 text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
  },
  purple: {
    bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    iconBg: 'bg-purple-500/20 text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300',
  },
};

const StatBadge = ({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'emerald',
  trend,
  className = '',
}) => {
  const theme = colorThemes[color] || colorThemes.emerald;

  return (
    <div
      className={`glass-panel p-5 rounded-2xl border transition-all duration-300 hover:border-slate-600 hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.iconBg}`}>
              <Icon size={24} />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">{label}</p>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
              {value}
            </h3>
          </div>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-3 pt-2.5 border-t border-slate-800/80">{subtitle}</p>}
    </div>
  );
};

export default StatBadge;
