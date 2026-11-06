import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-red-500/20 shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-400">
            <ShieldAlert size={34} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            This area requires a <strong className="text-emerald-400 capitalize">{allowedRoles.join(' or ')}</strong> account.
            You are currently signed in as a <span className="capitalize text-amber-300">{user?.role}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={user?.role === 'ngo' ? '/ngo' : '/donor'}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              Go to My {user?.role === 'ngo' ? 'NGO Hub' : 'Donor Dashboard'}
            </Link>
            <Link
              to="/"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
