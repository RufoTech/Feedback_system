import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, isAuthenticated, loadFromStorage } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is caught and stored by store
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative cosmic glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none animate-spin-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20 mb-3 shadow-inner shadow-primary-500/10">
            <span className="material-icons-round text-primary-400 text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            <span className="text-primary-500">Gusto</span> SuperAdmin
          </h1>
          <p className="text-dark-400 mt-2 font-medium">Sistem İdarəetmə Panelinə Giriş</p>
        </div>

        <div className="bg-dark-900/60 backdrop-blur-md rounded-3xl p-8 border border-dark-800 shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger-500/10 border border-danger-500/20 rounded-xl p-4 animate-scale-in">
                <p className="text-danger-400 text-sm font-medium flex items-center gap-2">
                  <span className="material-icons-round text-sm">error</span>
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">E-poçt ünvanı</label>
              <div className="relative">
                <span className="material-icons-round text-dark-500 text-[20px] absolute left-3.5 top-3.5">email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-950/80 border border-dark-700/80 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                  placeholder="superadmin@gusto.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2">Şifrə</label>
              <div className="relative">
                <span className="material-icons-round text-dark-500 text-[20px] absolute left-3.5 top-3.5">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-dark-950/80 border border-dark-700/80 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <span className="material-icons-round animate-spin text-[20px]">refresh</span>
                  Giriş edilir...
                </>
              ) : (
                <>
                  <span>Daxil ol</span>
                  <span className="material-icons-round text-[18px]">login</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
