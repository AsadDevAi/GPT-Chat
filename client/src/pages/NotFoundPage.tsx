import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center text-center p-4">
      <div>
        <h1 className="text-8xl font-bold text-muted mb-4">404</h1>
        <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Home size={16} />
          Go home
        </Link>
      </div>
    </div>
  );
}
