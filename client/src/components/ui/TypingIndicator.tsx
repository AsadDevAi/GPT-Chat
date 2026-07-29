import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1 py-1', className)}>
      <span className="typing-dot w-2 h-2 rounded-full bg-current opacity-60" />
      <span className="typing-dot w-2 h-2 rounded-full bg-current opacity-60" />
      <span className="typing-dot w-2 h-2 rounded-full bg-current opacity-60" />
    </div>
  );
}
