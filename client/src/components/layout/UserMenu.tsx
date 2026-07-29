import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth.api';
import { toast } from 'sonner';

export function UserMenu() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-2 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <span className="flex-1 text-left text-foreground/80 truncate text-xs font-medium">
          {user.name}
        </span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 mb-1 z-20 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
