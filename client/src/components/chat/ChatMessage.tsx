import { memo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, RefreshCw, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';
import { TypingIndicator } from '../ui/TypingIndicator';
import 'highlight.js/styles/github-dark.css';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-accent hover:text-accent-foreground transition-all text-muted-foreground"
      title="Copy message"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming = false,
  onRegenerate,
  isLastAssistant = false,
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="group flex justify-end gap-3 px-4 py-2 animate-fade-in">
        <div className="flex flex-col items-end gap-1 max-w-[80%]">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed">
            {message.content}
          </div>
          <CopyButton text={message.content} />
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
          <User size={14} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="group flex gap-3 px-4 py-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="flex-1 min-w-0">
        {isStreaming && !message.content ? (
          <div className="py-1">
            <TypingIndicator />
          </div>
        ) : (
          <>
            <div
              className={cn(
                'prose prose-sm dark:prose-invert max-w-none',
                'prose-p:my-2 prose-headings:my-3 prose-li:my-0.5',
                'prose-pre:my-2 prose-pre:bg-secondary prose-pre:text-secondary-foreground prose-pre:rounded-lg',
                'prose-code:text-violet-400 dark:prose-code:text-violet-300',
                'text-foreground/90 text-sm leading-7'
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {message.content}
              </ReactMarkdown>
            </div>
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-foreground/60 animate-pulse ml-0.5 align-middle" />
            )}
            {!isStreaming && (
              <div className="flex items-center gap-1 mt-1">
                <CopyButton text={message.content} />
                {isLastAssistant && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1 p-1 rounded hover:bg-accent hover:text-accent-foreground transition-all text-muted-foreground text-xs"
                    title="Regenerate response"
                  >
                    <RefreshCw size={12} />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});
