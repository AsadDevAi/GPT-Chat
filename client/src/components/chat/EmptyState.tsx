import { Sparkles, Zap, Code2, BookOpen, Globe, Lightbulb } from 'lucide-react';

const suggestions = [
  {
    icon: Code2,
    title: 'Write code',
    prompt: 'Write a Python script that scrapes data from a website and saves it to a CSV file.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 hover:bg-blue-500/20',
  },
  {
    icon: BookOpen,
    title: 'Explain concepts',
    prompt: 'Explain how neural networks work in simple terms with an analogy.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
  },
  {
    icon: Globe,
    title: 'Translate text',
    prompt: 'Translate "The future belongs to those who believe in the beauty of their dreams" into French, Spanish, and Japanese.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm ideas',
    prompt: 'Give me 10 creative business ideas that can be started with less than $1000.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 hover:bg-amber-500/20',
  },
  {
    icon: Zap,
    title: 'Debug code',
    prompt: 'What are the most common JavaScript bugs and how do I fix them?',
    color: 'text-red-400',
    bg: 'bg-red-500/10 hover:bg-red-500/20',
  },
  {
    icon: Sparkles,
    title: 'Creative writing',
    prompt: 'Write a short story about an AI that discovers the meaning of creativity.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 hover:bg-pink-500/20',
  },
];

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 pb-20 select-none">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25">
          <Sparkles size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-sm">
          Ask me anything — I can help with coding, writing, analysis, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.title}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className={`${suggestion.bg} border border-border rounded-xl p-4 text-left transition-all duration-200 group hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className={`${suggestion.color} mb-2`}>
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {suggestion.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {suggestion.prompt}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
