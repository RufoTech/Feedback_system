import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function SuperAdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/restaurants', label: 'Restoranlar', icon: 'storefront' },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
        <div className="p-6 border-b border-dark-800">
          <h1 className="text-xl font-bold text-white tracking-wide">
            <span className="text-primary-500 font-extrabold">Gusto</span> SuperAdmin
          </h1>
          {user && (
            <p className="text-dark-400 text-xs mt-1 font-medium">{user.name}</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                }`
              }
            >
              <span className="material-icons-round text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-800">
          <div className="px-4 py-3 bg-dark-950/50 rounded-xl border border-dark-800/80 mb-3 overflow-hidden text-ellipsis">
            <p className="text-xs text-dark-500 font-medium">İstifadəçi</p>
            <p className="text-xs font-semibold text-dark-300 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-dark-400 hover:text-danger-400 hover:bg-dark-800/80 transition-all duration-200 w-full"
          >
            <span className="material-icons-round text-[20px]">logout</span>
            Çıxış
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
