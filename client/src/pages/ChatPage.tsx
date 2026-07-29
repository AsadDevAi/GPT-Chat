import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { MessageList } from '@/components/chat/MessageList';

export function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-2 px-4 py-3 border-b border-border md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-foreground/80">GPT Chat</span>
        </header>

        <MessageList />
      </main>
    </div>
  );
}
