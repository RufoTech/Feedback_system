import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kod doğrulama state-ləri
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { step, adminEmail, sendCode, verifyCode } = useAuth();
  const navigate = useNavigate();

  // Kod inputuna avtomatik fokus
  useEffect(() => {
    if (step === 'verify') {
      codeInputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Zəhmət olmasa bütün sahələri doldurun');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await sendCode(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Kod göndərilmədi. Yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Zəhmət olmasa 6 rəqəmli kodu daxil edin');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await verifyCode(fullCode);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Kod yanlışdır. Yenidən cəhd edin.');
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Yapışdırma (paste) üçün: bütün kodu bir anda daxil etmək
      const digits = value.replace(/\D/g, '').split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      // Sonuncu doldurulmuş inputa fokuslan
      const focusIndex = Math.min(index + digits.length, 5);
      codeInputRefs.current[focusIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Avtomatik növbəti inputa keç
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleGoBack = () => {
    setCode(['', '', '', '', '', '']);
    setError(null);
    window.location.reload();
  };

  // Kod doğrulama ekranı
  if (step === 'verify') {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-background">
        {/* Left side: Premium Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-[#1b1c1c] via-[#2d2a22] to-[#735c00] text-[#fbf9f9] flex-col justify-between p-12 relative overflow-hidden select-none">
          <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-10 left-10 w-[200px] h-[200px] rounded-full bg-primary-container/10 blur-[80px] pointer-events-none"></div>

          <div className="flex items-center space-x-3 z-10">
            <img
              alt="Gusto Logo"
              className="h-12 w-12 object-contain"
              src="/favicon.svg"
            />
            <span className="text-headline-md font-headline-md tracking-wider text-primary-container font-bold">Gusto</span>
          </div>

          <div className="my-auto z-10 max-w-md">
            <h2 className="text-display-lg font-display-lg text-[#ffe088] leading-tight tracking-tight mb-4">
              Təhlükəsiz giriş
            </h2>
            <p className="text-body-lg font-body-lg text-[#e5e2e1]/80 leading-relaxed font-light">
              E-poçt ünvanınıza göndərilən 6 rəqəmli kodu daxil edərək girişi tamamlayın.
            </p>
          </div>

          <div className="text-label-sm font-label-sm text-[#e5e2e1]/50 z-10">
            &copy; 2026 Gusto Kiosk. Bütün hüquqlar qorunur.
          </div>
        </div>

        {/* Right side: Code Verification */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#fbf9f9]">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.02)] border border-outline-variant/20 transition-all duration-300">
            <div className="text-center">
              <div className="flex md:hidden items-center justify-center space-x-2 mb-6">
                <img
                  alt="Gusto Logo"
                  className="h-10 w-10 object-contain"
                  src="/favicon.svg"
                />
                <span className="text-headline-md font-headline-md text-primary font-bold">Gusto</span>
              </div>

              {/* Mail icon and title */}
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">forward_to_inbox</span>
              </div>
              <h2 className="text-headline-lg font-headline-lg text-[#1b1c1c] tracking-tight">Kodu daxil edin</h2>
              <p className="mt-2 text-body-md font-body-md text-secondary">
                <strong>{adminEmail}</strong> ünvanına göndərilən 6 rəqəmli kodu yazın
              </p>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/20 text-error p-4 rounded-xl flex items-center space-x-3 text-body-md animate-shake">
                <span className="material-symbols-outlined shrink-0 text-xl">error</span>
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleVerifyCode}>
              {/* 6-digit code inputs */}
              <div className="flex justify-center gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { codeInputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-14 h-16 text-center text-headline-md font-bold bg-[#f5f3f3] hover:bg-[#efeded] focus:bg-white border-2 border-transparent focus:border-primary/40 rounded-xl text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                ))}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting || code.join('').length !== 6}
                className="relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-label-md font-label-md font-bold text-on-primary bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 group"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Doğrulanır...
                  </>
                ) : (
                  <>
                    Təsdiq et
                    <span className="material-symbols-outlined text-lg ml-2 group-hover:translate-x-1 transition-transform">
                      check_circle
                    </span>
                  </>
                )}
              </button>

              {/* Back button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="text-label-md font-label-md text-secondary hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-base align-text-bottom">arrow_back</span>
                  Geri qayıt
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Email + Password login ekranı
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side: Premium Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-[#1b1c1c] via-[#2d2a22] to-[#735c00] text-[#fbf9f9] flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Decorative subtle background pattern/gradient glow */}
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[200px] h-[200px] rounded-full bg-primary-container/10 blur-[80px] pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center space-x-3 z-10">
          <img
            alt="Gusto Logo"
            className="h-12 w-12 object-contain"
            src="/favicon.svg"
          />
          <span className="text-headline-md font-headline-md tracking-wider text-primary-container font-bold">Gusto</span>
        </div>

        {/* Center Content */}
        <div className="my-auto z-10 max-w-md">
          <h2 className="text-display-lg font-display-lg text-[#ffe088] leading-tight tracking-tight mb-4">
            Dadın və xidmətin mükəmməlliyi
          </h2>
          <p className="text-body-lg font-body-lg text-[#e5e2e1]/80 leading-relaxed font-light">
            Gusto restoran rəhbərliyi sistemi. Müştəri rəylərini, ofisiant çağırışlarını və xidmət sorğularını real zamanlı olaraq idarə edin.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-label-sm font-label-sm text-[#e5e2e1]/50 z-10">
          &copy; 2026 Gusto Kiosk. Bütün hüquqlar qorunur.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#fbf9f9]">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-[0px_8px_30px_rgba(0,0,0,0.02)] border border-outline-variant/20 transition-all duration-300">
          <div className="text-center md:text-left">
            {/* Logo on mobile view only */}
            <div className="flex md:hidden items-center justify-center space-x-2 mb-6">
              <img
                alt="Gusto Logo"
                className="h-10 w-10 object-contain"
                src="/favicon.svg"
              />
              <span className="text-headline-md font-headline-md text-primary font-bold">Gusto</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-[#1b1c1c] tracking-tight">Admin Girişi</h2>
            <p className="mt-2 text-body-md font-body-md text-secondary">
              İdarəetmə panelinə daxil olmaq üçün məlumatlarınızı yazın
            </p>
          </div>

          {error && (
            <div className="bg-error-container/20 border border-error/20 text-error p-4 rounded-xl flex items-center space-x-3 text-body-md animate-shake">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSendCode}>
            {/* Email field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-label-md font-label-md text-on-surface-variant">
                E-poçt ünvanı
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@gusto.com"
                  className="block w-full pl-11 pr-4 py-3 bg-[#f5f3f3] hover:bg-[#efeded] focus:bg-white border-none rounded-xl text-body-md text-[#1b1c1c] placeholder:text-[#4d4635]/40 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-label-md font-label-md text-on-surface-variant">
                  Şifrə
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-[#f5f3f3] hover:bg-[#efeded] focus:bg-white border-none rounded-xl text-body-md text-[#1b1c1c] placeholder:text-[#4d4635]/40 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-xl select-none">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-label-md font-label-md font-bold text-on-primary bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Giriş edilir...
                </>
              ) : (
                <>
                  Daxil ol
                  <span className="material-symbols-outlined text-lg ml-2 group-hover:translate-x-1 transition-transform">
                    login
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
