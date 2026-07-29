import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chatStore';
import { chatApi, getStreamUrl, getRegenerateUrl } from '@/api/chat.api';
import { ChatMessage } from './ChatMessage';
import { ChatInput, ScrollToBottomButton } from './ChatInput';
import { EmptyState } from './EmptyState';
import type { Message } from '@/types';
import { toast } from 'sonner';

export function MessageList() {
  const { id: chatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    messages,
    setMessages,
    addMessage,
    isStreaming,
    streamingContent,
    setIsStreaming,
    setStreamingContent,
    appendStreamingContent,
    isLoadingMessages,
    setIsLoadingMessages,
    updateChat,
    addChat,
  } = useChatStore();

  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    setIsLoadingMessages(true);
    try {
      const { data } = await chatApi.getMessages(chatId);
      setMessages(data.messages);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [chatId, setMessages, setIsLoadingMessages]);

  useEffect(() => {
    if (chatId) {
      loadMessages();
      setStreamingContent('');
      setStreamingMessage(null);
    } else {
      setMessages([]);
    }
  }, [chatId, loadMessages, setMessages, setStreamingContent]);

  useEffect(() => {
    if (isStreaming || messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, isStreaming, streamingContent]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    setShowScrollButton(!isNearBottom);
  };

  const sendMessage = useCallback(
    async (content: string) => {
      let activeChatId = chatId;

      if (!activeChatId) {
        try {
          const { data } = await chatApi.createChat();
          activeChatId = data.chat._id;
          addChat(data.chat);
          navigate(`/chat/${activeChatId}`, { replace: true });
        } catch {
          toast.error('Failed to create chat');
          return;
        }
      }

      const tempUserMessage: Message = {
        _id: `temp-${Date.now()}`,
        chatId: activeChatId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      };

      addMessage(tempUserMessage);

      const tempAssistantMessage: Message = {
        _id: `temp-assistant-${Date.now()}`,
        chatId: activeChatId,
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      };

      setIsStreaming(true);
      setStreamingContent('');
      setStreamingMessage(tempAssistantMessage);

      abortControllerRef.current = new AbortController();

      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(getStreamUrl(activeChatId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No response body');

        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter((l) => l.startsWith('data:'));

          for (const line of lines) {
            try {
              const json = JSON.parse(line.slice(5).trim());
              if (json.content) {
                fullContent += json.content;
                appendStreamingContent(json.content);
              }
              if (json.done) {
                const finalMessage: Message = {
                  ...tempAssistantMessage,
                  content: fullContent,
                };
                setStreamingMessage(null);
                addMessage(finalMessage);
                setIsStreaming(false);
                setStreamingContent('');

                const updatedChats = await chatApi.getChats();
                const updatedChat = updatedChats.data.chats.find(
                  (c) => c._id === activeChatId
                );
                if (updatedChat) {
                  updateChat(activeChatId!, { title: updatedChat.title });
                }
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      } catch (err: unknown) {
        if ((err as Error).name === 'AbortError') {
          setStreamingMessage(null);
          setIsStreaming(false);
          setStreamingContent('');
        } else {
          toast.error('Failed to get response');
          setStreamingMessage(null);
          setIsStreaming(false);
          setStreamingContent('');
        }
      }
    },
    [chatId, addMessage, addChat, navigate, setIsStreaming, setStreamingContent, appendStreamingContent, updateChat]
  );

  const handleRegenerate = useCallback(async () => {
    if (!chatId || isStreaming) return;

    const tempAssistantMessage: Message = {
      _id: `temp-regen-${Date.now()}`,
      chatId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    };

    setIsStreaming(true);
    setStreamingContent('');
    setStreamingMessage(tempAssistantMessage);

    abortControllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(getRegenerateUrl(chatId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed to regenerate');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data:'));

        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(5).trim());
            if (json.content) {
              fullContent += json.content;
              appendStreamingContent(json.content);
            }
            if (json.done) {
              setStreamingMessage(null);
              await loadMessages();
              setIsStreaming(false);
              setStreamingContent('');
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        toast.error('Failed to regenerate');
      }
      setStreamingMessage(null);
      setIsStreaming(false);
      setStreamingContent('');
    }
  }, [chatId, isStreaming, setIsStreaming, setStreamingContent, appendStreamingContent, loadMessages]);

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt);
  };

  const allMessages = streamingMessage
    ? [
        ...messages,
        { ...streamingMessage, content: streamingContent },
      ]
    : messages;

  const lastAssistantIndex = allMessages.reduce(
    (acc, m, i) => (m.role === 'assistant' ? i : acc),
    -1
  );

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-3 w-full max-w-2xl px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div
                className={`h-4 bg-muted rounded-full mb-2 ${i % 2 === 0 ? 'w-3/4 ml-auto' : 'w-full'}`}
              />
              <div className={`h-3 bg-muted rounded-full ${i % 2 === 0 ? 'w-1/2 ml-auto' : 'w-4/5'}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
      >
        {allMessages.length === 0 && !isStreaming ? (
          <EmptyState onSuggestionClick={handleSuggestion} />
        ) : (
          <div className="max-w-3xl mx-auto py-4 space-y-1">
            {allMessages.map((msg, index) => (
              <ChatMessage
                key={msg._id}
                message={msg}
                isStreaming={isStreaming && index === allMessages.length - 1 && msg.role === 'assistant'}
                onRegenerate={handleRegenerate}
                isLastAssistant={index === lastAssistantIndex}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ScrollToBottomButton onClick={scrollToBottom} visible={showScrollButton} />

      <ChatInput onSend={sendMessage} isStreaming={isStreaming} onStop={handleStop} />
    </div>
  );
}
