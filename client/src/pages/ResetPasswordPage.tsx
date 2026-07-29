import { useState, type FormEvent } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { extractErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset successfully! You can now sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">New password</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your new password below</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
          {!token ? (
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Invalid reset link.</p>
              <Link to="/forgot-password" className="text-violet-400 hover:text-violet-300 text-sm">
                Request new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="w-full pl-10 pr-10 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
