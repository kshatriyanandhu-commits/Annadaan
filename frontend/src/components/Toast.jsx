import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  if (!toast || !toast.message) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200',
      icon: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
      bar: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-950/95 border-rose-500/40 text-rose-200',
      icon: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
      bar: 'bg-rose-500',
    },
    info: {
      bg: 'bg-teal-950/95 border-teal-500/40 text-teal-200',
      icon: <Info size={18} className="text-teal-400 shrink-0" />,
      bar: 'bg-teal-500',
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slideInRight">
      <div
        className={`glass-panel p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 overflow-hidden relative ${config.bg}`}
      >
        <div className="flex items-start gap-3">
          {config.icon}
          <div>
            {toast.title && <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-0.5">{toast.title}</h5>}
            <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
        >
          <X size={15} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div className={`h-full ${config.bar} animate-shrinkWidth`} />
        </div>
      </div>
    </div>
  );
};

export default Toast;
