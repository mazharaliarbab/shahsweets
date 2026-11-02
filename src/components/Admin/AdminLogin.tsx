import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BRAND_ASSETS } from '../../data/initialData';
import { ShieldCheck, Lock, ArrowLeft, KeyRound, AlertCircle, Info, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, goBack } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = loginAdmin(password);
      setIsLoading(false);
      if (!success) {
        setError('Incorrect password. Please verify the credentials or consult the setup instructions below.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0d0406] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back Arrow Option */}
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#e8c86a] hover:text-white transition-colors cursor-pointer bg-[#18060b] px-3.5 py-2 rounded-full border border-[#c99846]/30 shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back to Previous Page</span>
        </button>

        {/* Login Card */}
        <div className="bg-[#18060b] border border-[#c99846]/40 rounded-3xl p-7 sm:p-9 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Brand Emblem */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#e8c86a] via-[#c99846] to-[#4f1220] shadow-md">
              <img
                src={BRAND_ASSETS.logo}
                alt="Shah Sweets and Bakers"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif-brand text-[#fdfaf4]">
                Admin Portal
              </h1>
              <p className="text-xs text-[#c99846] mt-0.5">
                Shah Sweets and Bakers • Shabqadar
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#e8c86a] uppercase tracking-wider mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#c99846] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter administrator password..."
                  className="w-full bg-[#240810] border border-[#c99846]/30 focus:border-[#e8c86a] rounded-xl pl-10 pr-10 py-3 text-sm text-[#fdfaf4] placeholder-[#f8f1e3]/40 focus:outline-none transition-colors"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f8f1e3]/60 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:brightness-110 disabled:opacity-50 text-[#140508] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#140508] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Setup Guidance */}
          <div className="pt-4 border-t border-[#c99846]/20 bg-[#120407] -mx-7 -mb-7 sm:-mx-9 sm:-mb-9 p-5 text-xs text-[#f8f1e3]/75 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-[#e8c86a]">
              <Info className="w-3.5 h-3.5 text-[#c99846]" />
              <span>Default Shop Administrator Credentials</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Default password: <code className="bg-[#2b0c15] text-[#e8c86a] px-1.5 py-0.5 rounded font-mono font-bold">shah1234</code>. You can change this password at any time inside the <strong>Settings</strong> tab once logged in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
