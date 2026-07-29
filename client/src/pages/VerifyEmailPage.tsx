import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Sparkles } from 'lucide-react';
import { authApi } from '@/api/auth.api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const { data } = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(data.message);
      } catch (err: unknown) {
        setStatus('error');
        const error = err as { response?: { data?: { message?: string } } };
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={22} className="text-white" />
          </div>

          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 size={40} className="text-violet-400 mx-auto animate-spin" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Email verified!</h2>
              <p className="text-muted-foreground text-sm">{message}</p>
              <Link
                to="/login"
                className="inline-block mt-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all"
              >
                Sign in
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle size={40} className="text-red-400 mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">Verification failed</h2>
              <p className="text-muted-foreground text-sm">{message}</p>
              <Link
                to="/login"
                className="inline-block mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
