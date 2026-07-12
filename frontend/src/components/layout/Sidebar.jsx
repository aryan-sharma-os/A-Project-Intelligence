import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, GitCompare, Heart, Newspaper, Activity, LogOut, LogIn, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useWatchlistStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

const NavItem = ({ to, icon: Icon, label, exact = false }) => (
  <NavLink
    to={to}
    end={exact}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
        isActive
          ? "bg-zinc-800 text-white shadow-sm"
          : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-emerald-400")} />
        {label}
      </>
    )}
  </NavLink>
);

const WATCHLIST_TICKERS = {
  'AAPL': { name: 'Apple Inc.', price: '$313.39', change: '+0.80%', positive: true },
  'MSFT': { name: 'Microsoft', price: '$416.32', change: '+0.28%', positive: true },
  'GOOGL': { name: 'Alphabet', price: '$172.21', change: '-0.27%', positive: false },
  'AMZN': { name: 'Amazon', price: '$186.32', change: '+0.65%', positive: true },
  'TSLA': { name: 'Tesla', price: '$181.73', change: '-0.41%', positive: false },
  'NVDA': { name: 'NVIDIA', price: '$204.12', change: '+1.23%', positive: true },
  'META': { name: 'Meta Platforms', price: '$507.45', change: '+0.92%', positive: true },
  'NFLX': { name: 'Netflix', price: '$721.80', change: '+0.34%', positive: true },
};

const Sidebar = () => {
  const { watchlist } = useWatchlistStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-60 h-screen fixed left-0 top-0 bg-[#0A0A0A] border-r border-zinc-800/50 flex flex-col z-50">

      {/* Brand */}
      <div className="h-14 flex items-center px-5 border-b border-zinc-800/50">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">A-Project</span>
        </NavLink>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">

        <div className="space-y-1">
          <NavItem to="/" exact icon={Search} label="Research" />
          <NavItem to="/compare" icon={GitCompare} label="Compare" />
          <NavItem to="/watchlist" icon={Heart} label="Watchlist" />
          <NavItem to="/history" icon={Newspaper} label="History" />
        </div>

        {/* Watchlist Preview */}
        {watchlist.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Watchlist</span>
              <NavLink to="/watchlist" className="text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors">View all</NavLink>
            </div>
            <div className="space-y-0.5">
              {watchlist.slice(0, 5).map(t => {
                const info = WATCHLIST_TICKERS[t] || { name: t, price: '—', change: '—', positive: true };
                return (
                  <div key={t} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-black text-white group-hover:border-emerald-500/50 transition-colors">
                        {t[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-none">{t}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{info.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white leading-none">{info.price}</div>
                      <div className={cn("text-[10px] mt-0.5 font-bold", info.positive ? "text-emerald-400" : "text-red-400")}>{info.change}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-zinc-800/50">
        {user ? (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-emerald-400 border border-zinc-700 uppercase">
                {user.name?.substring(0, 2) || 'US'}
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none max-w-[100px] truncate">{user.name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5 max-w-[100px] truncate">{user.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 py-2 rounded-lg text-xs font-bold transition-colors">
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
