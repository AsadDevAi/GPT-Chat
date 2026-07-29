import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { extractErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
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
          <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <Mail size={24} className="text-emerald-400" />
              </div>
              <p className="text-foreground font-medium">Check your email</p>
              <p className="text-muted-foreground text-sm">
                If an account with <strong className="text-foreground">{email}</strong> exists,
                you'll receive a password reset link shortly.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
