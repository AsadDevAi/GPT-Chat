import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Square, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (content: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, isStreaming, onStop, disabled }: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [content, adjustHeight]);

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming]);

  const handleSubmit = () => {
    const trimmed = content.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl border transition-all duration-200',
            'bg-muted border-input',
            'focus-within:border-violet-500/50 focus-within:shadow-lg focus-within:shadow-violet-500/10',
            disabled && 'opacity-50'
          )}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message GPT Chat..."
            disabled={disabled || isStreaming}
            rows={1}
            className={cn(
              'flex-1 bg-transparent resize-none px-4 py-3.5 text-sm text-foreground',
              'placeholder:text-muted-foreground focus:outline-none',
              'min-h-[52px] max-h-[200px] leading-relaxed',
              (disabled || isStreaming) && 'opacity-50 cursor-not-allowed'
            )}
          />
          <div className="flex items-end pb-2 pr-2">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-background hover:bg-accent text-foreground transition-all"
                title="Stop generating"
              >
                <Square size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || disabled}
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg transition-all',
                  content.trim() && !disabled
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
                title="Send message (Enter)"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground/50 mt-2">
          GPT Chat can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}

interface ScrollToBottomButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function ScrollToBottomButton({ onClick, visible }: ScrollToBottomButtonProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute bottom-24 right-4 w-8 h-8 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all animate-fade-in"
    >
      <ArrowDown size={14} />
    </button>
  );
}
