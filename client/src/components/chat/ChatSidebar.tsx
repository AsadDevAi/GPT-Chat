import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  Trash2,
  Pencil,
  Check,
  X,
  Search,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { chatApi } from '@/api/chat.api';
import { formatDate } from '@/lib/utils';
import type { Chat } from '@/types';
import { toast } from 'sonner';
import { ThemeToggle } from '../layout/ThemeToggle';
import { UserMenu } from '../layout/UserMenu';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const { chats, setChats, addChat, updateChat, removeChat, setIsLoadingChats } =
    useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const loadChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const { data } = await chatApi.getChats();
      setChats(data.chats);
    } catch {
      toast.error('Failed to load chats');
    } finally {
      setIsLoadingChats(false);
    }
  }, [setChats, setIsLoadingChats]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleNewChat = async () => {
    try {
      const { data } = await chatApi.createChat();
      addChat(data.chat);
      navigate(`/chat/${data.chat._id}`);
      if (window.innerWidth < 768) onClose();
    } catch {
      toast.error('Failed to create chat');
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await chatApi.deleteChat(id);
      removeChat(id);
      if (activeChatId === id) navigate('/');
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete chat');
    }
  };

  const handleStartEdit = (e: React.MouseEvent, chat: Chat) => {
    e.stopPropagation();
    setEditingId(chat._id);
    setEditingTitle(chat.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const { data } = await chatApi.updateChat(id, editingTitle.trim());
      updateChat(id, { title: data.chat.title });
      setEditingId(null);
    } catch {
      toast.error('Failed to rename chat');
      setEditingId(null);
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') handleSaveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChats = filteredChats.reduce<Record<string, Chat[]>>((acc, chat) => {
    const group = formatDate(chat.updatedAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
    return acc;
  }, {});

  const groupOrder = ['Today', 'Yesterday'];
  const sortedGroups = [
    ...groupOrder.filter((g) => groupedChats[g]),
    ...Object.keys(groupedChats).filter((g) => !groupOrder.includes(g)),
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-30 md:z-auto
          w-64 flex flex-col h-full
          bg-sidebar-bg border-r border-border
          transition-transform duration-250 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-3 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground/90">GPT Chat</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground md:hidden"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        <div className="px-2 pb-2">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm text-foreground/80 font-medium"
          >
            <Plus size={16} />
            New chat
          </button>
        </div>

        <div className="px-2 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-4">
          {sortedGroups.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              {searchQuery ? 'No matching chats' : 'No chats yet'}
            </p>
          )}

          {sortedGroups.map((group) => (
            <div key={group}>
              <p className="text-xs font-medium text-muted-foreground px-2 pb-1 uppercase tracking-wider">
                {group}
              </p>
              <div className="space-y-0.5">
                {groupedChats[group].map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => {
                      navigate(`/chat/${chat._id}`);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`
                      group relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
                      transition-colors text-sm
                      ${activeChatId === chat._id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    <MessageSquare size={14} className="flex-shrink-0 opacity-60" />

                    {editingId === chat._id ? (
                      <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          ref={editInputRef}
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, chat._id)}
                          className="flex-1 min-w-0 bg-background rounded px-1 text-xs text-foreground outline-none border border-violet-500/50"
                        />
                        <button onClick={() => handleSaveEdit(chat._id)} className="text-green-400 hover:text-green-300 flex-shrink-0">
                          <Check size={12} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 truncate text-xs">{chat.title}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => handleStartEdit(e, chat)}
                            className="p-0.5 rounded hover:text-foreground text-muted-foreground"
                          >
                            <Pencil size={11} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteChat(e, chat._id)}
                            className="p-0.5 rounded hover:text-red-400 text-muted-foreground"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-2 border-t border-border">
          <UserMenu />
        </div>
      </aside>
    </>
  );
}
