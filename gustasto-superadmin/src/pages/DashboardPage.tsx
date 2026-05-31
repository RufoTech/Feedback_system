import { useState, useEffect } from 'react';
import api from '../api/axios';
import { NavLink } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalRequests: 0,
    totalTables: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get('/super-admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Stats loading failed', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Ümumi Restoranlar', value: stats.totalRestaurants, icon: 'storefront', color: 'primary', path: '/restaurants' },
    { label: 'Ümumi Masalar', value: stats.totalTables, icon: 'deck', color: 'accent', path: '/restaurants' },
    { label: 'Ümumi Rəylər (Feedbacks)', value: stats.totalRequests, icon: 'chat', color: 'success', path: '/restaurants' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-icons-round animate-spin text-primary-500 text-4xl">refresh</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide">Sistem Dashboard</h1>
        <p className="text-dark-400 mt-1 font-medium">Bütün restoranlar və sistem göstəriciləri</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <NavLink
            key={i}
            to={card.path}
            className="bg-dark-900 rounded-2xl p-6 border border-dark-800 hover:border-primary-500/40 transition-all duration-300 shadow-xl flex items-center justify-between group active:scale-[0.99]"
          >
            <div>
              <p className="text-dark-400 text-sm font-semibold tracking-wide uppercase">{card.label}</p>
              <p className="text-4xl font-extrabold text-white mt-2 group-hover:text-primary-400 transition-colors">{card.value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              card.color === 'primary' ? 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20' :
              card.color === 'accent' ? 'bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20' :
              'bg-success-500/10 text-success-400 group-hover:bg-success-500/20'
            }`}>
              <span className="material-icons-round text-3xl">{card.icon}</span>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Systems Overview Section */}
      <div className="bg-dark-900 rounded-3xl border border-dark-800 p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Sistem haqqında qısa məlumat</h2>
        <div className="text-dark-300 space-y-4 text-sm font-medium">
          <p>
            Bu panel vasitəsilə siz sistemdəki bütün restoranların siyahısına baxa bilər, yeni restoranlar yarada, onların admin e-poçt və şifrələrini idarə edə bilərsiniz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-dark-950/60 rounded-2xl border border-dark-800 flex items-start gap-3">
              <span className="material-icons-round text-primary-400 mt-0.5">security</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Təhlükəsizlik</h4>
                <p className="text-xs text-dark-400">Hər bir restoranın öz məlumat bazası ayrılığı və fərqli şifrələri mövcuddur.</p>
              </div>
            </div>
            <div className="p-4 bg-dark-950/60 rounded-2xl border border-dark-800 flex items-start gap-3">
              <span className="material-icons-round text-accent-400 mt-0.5">devices</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Kiosk və Admin Panellər</h4>
                <p className="text-xs text-dark-400">Yeni restoran yaradıldıqda, o avtomatik olaraq öz admin hesabı ilə normal admin panelinə daxil ola bilər.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
