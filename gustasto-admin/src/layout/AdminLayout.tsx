import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center px-4 py-3 rounded-lg transition-colors group cursor-pointer ${
    isActive
      ? 'bg-primary-container text-on-primary-container font-semibold'
      : 'text-on-surface-variant hover:bg-surface-variant/50'
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
    isActive
      ? 'bg-primary-container text-on-primary-container rounded-full scale-95 font-semibold'
      : 'text-on-surface-variant hover:bg-secondary-container/50'
  }`;

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  let pageTitle = 'İcmal';
  if (location.pathname === '/analytics') pageTitle = 'Analitika';
  else if (location.pathname === '/tables') pageTitle = 'Masalar';

  const handleLogout = () => {
    if (window.confirm('Hesabdan çıxış etmək istədiyinizə əminsiniz?')) {
      logout();
    }
  };

  const adminName = admin?.name || 'Admin User';
  const adminEmail = admin?.email || 'admin@gusto.com';

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased">
      {/* Mobile TopAppBar (hidden on md) */}
      <header className="md:hidden flex justify-between items-center w-full px-container-margin py-base z-50 bg-surface/90 backdrop-blur-md shadow-sm sticky top-0 full-width">
        <h1 className="text-headline-lg-mobile font-headline-lg-mobile font-bold text-primary tracking-tight">Gusto Admin</h1>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="text-error p-2 rounded-full hover:bg-error/10 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-outline-variant/30 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 relative">
        <div className="p-6 flex items-center justify-center border-b border-outline-variant/20">
          <img
            alt="Gusto Logo"
            className="h-12 w-12 object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0ugHZELWWzv84yZGC4tvvUpEAGiMy-hWwrEPimn76u12Bz8k4j5IvYSzkO_epoaF9FZwJFpK5K6zGodHshqZwZO82yBkH-NZGraLV0rfMizR7J-G1UkeeX-l3Qk0egZD3nJPmTxkNqnZdiRcAHmYfVYa9zJpM6qQbOdLYRPoTRTUS0hJt9g8-Et9S2JtD7777-_VMKU2nQLtdJxwLXibxta60PIdkzp7bVNfdKc4l2asTYMSn1O7iEwwfQPR"
          />
          <span className="text-headline-md font-headline-md text-primary ml-3 font-bold tracking-tight">Gusto</span>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavLink to="/" end className={navLinkClass}>
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </NavLink>
          <NavLink to="/analytics" className={navLinkClass}>
            <span className="material-symbols-outlined mr-3">bar_chart</span>
            <span className="font-body-md text-body-md">Analitika</span>
          </NavLink>
          <NavLink to="/tables" className={navLinkClass}>
            <span className="material-symbols-outlined mr-3">deck</span>
            <span className="font-body-md text-body-md">Masalar</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-outline-variant/20 mt-auto">
          <div className="mt-4 flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="font-label-sm text-label-sm text-on-surface truncate max-w-[120px] font-semibold">{adminName}</p>
                <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{adminEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-surface-variant/40"
              title="Çıxış et"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
        {/* Top Toolbar */}
        <div className="h-16 border-b border-outline-variant/20 bg-surface flex items-center justify-between px-6 shrink-0">
          <h2 className="hidden md:block text-title-lg font-title-lg text-on-surface font-bold">{pageTitle}</h2>
          <div className="flex items-center space-x-4 flex-1 md:flex-none justify-end md:justify-start ml-auto">
            <div className="flex items-center bg-surface-container rounded-full px-3 py-1.5 cursor-pointer hover:bg-surface-variant transition-colors border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">calendar_today</span>
              <span className="font-label-sm text-label-sm text-on-surface">Bugün, {new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>

        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (hidden on md) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-container-margin pb-6 pt-2 bg-surface border-t border-outline-variant shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl full-width">
        <NavLink to="/" end className={mobileNavLinkClass}>
          <span className="material-symbols-outlined transition-transform mb-1">dashboard</span>
          <span className="text-label-sm font-label-sm">Ana səhifə</span>
        </NavLink>
        <NavLink to="/analytics" className={mobileNavLinkClass}>
          <span className="material-symbols-outlined mb-1">bar_chart</span>
          <span className="text-label-sm font-label-sm">Analitika</span>
        </NavLink>
        <NavLink to="/tables" className={mobileNavLinkClass}>
          <span className="material-symbols-outlined mb-1">deck</span>
          <span className="text-label-sm font-label-sm">Masalar</span>
        </NavLink>
      </nav>
    </div>
  );
};
