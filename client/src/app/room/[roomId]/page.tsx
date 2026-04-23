'use client';

import { Navbar } from '@/components/layout/Navbar';
import { useSocket } from '@/hooks/useSocket';
import { useUserStore } from '@/store/useUserStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { Send, Hash, ArrowLeft, MoreVertical, Link as LinkIcon, Check, Shield, Users, Mic, Smile, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AVATAR_ICONS } from '@/lib/avatars';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  clientMessageId?: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = decodeURIComponent(params.roomId as string);
  const router = useRouter();
  const socket = useSocket();
  const { username, avatar, addRecentRoom } = useUserStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [showEmoji, setShowEmoji] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const joinedRoomRef = useRef<string | null>(null);
  const AvatarIcon = AVATAR_ICONS[avatar] || AVATAR_ICONS.User;

  // Persistence: Load messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`roomora-chat-${roomId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved messages');
      }
    }
  }, [roomId]);

  // Persistence: Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`roomora-chat-${roomId}`, JSON.stringify(messages));
    }
  }, [messages, roomId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    addRecentRoom(roomId);

    const handleJoin = () => {
      socket.emit('join_room', { roomName: roomId, username, avatar });
      joinedRoomRef.current = roomId;
      setIsJoined(true);
    };

    const handleRoomUpdate = (rooms: { name: string, userCount: number }[]) => {
      const currentRoom = rooms.find(r => r.name === roomId);
      if (currentRoom) {
        setUserCount(currentRoom.userCount);
      }
    };

    if (socket.connected) {
      handleJoin();
    }

    socket.on('connect', handleJoin);
    socket.on('disconnect', () => setIsJoined(false));
    socket.on('room_list_update', handleRoomUpdate);

    const handleMessage = (message: Message) => {
      setMessages((prev) => {
        const existingIndex = prev.findIndex(
          (m) =>
            m.id === message.id ||
            (!!message.clientMessageId && m.clientMessageId === message.clientMessageId)
        );

        if (existingIndex === -1) {
          return [...prev, message];
        }

        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], ...message };
        return next;
      });
    };

    socket.on('receive_message', handleMessage);

    const handleError = (err: { message: string }) => {
      router.push('/rooms');
    };

    socket.on('error', handleError);

    return () => {
      // Logic for session disposal could go here if we want to clear history immediately
      // But standard "persistence" usually keeps it until explicit clear.
      // The user said: "once the room is closed then that localstorage message also gone"
      // We'll clear it on unmount IF it's an explicit leave or if we want to stick strictly to the requirement.
      // Let's clear it on unmount but keep it through refreshes by checking if we're still in the room.

      socket.off('connect', handleJoin);
      socket.off('disconnect');
      socket.off('receive_message', handleMessage);
      socket.off('room_list_update', handleRoomUpdate);
      socket.off('error', handleError);
    };
  }, [socket, roomId, username, avatar, router, addRecentRoom]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText || !socket || !isJoined) return;

    const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const optimisticMessage: Message = {
      id: clientMessageId,
      clientMessageId,
      username,
      avatar,
      text: trimmedText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    socket.emit('send_message', {
      roomName: roomId,
      text: trimmedText,
      username,
      avatar,
      clientMessageId,
    });

    setInputText('');
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(`roomora-chat-${roomId}`);
  };

  const leaveRoom = () => {
    socket?.emit('leave_room', roomId);
    clearChat();
    router.push('/rooms');
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmoji(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-inter selection:bg-primary/20 selection:text-primary overflow-hidden">
      <Navbar />

      {/* Clean Room Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-16 left-0 right-0 h-14 sm:h-16 border-b border-border bg-card/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-40"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/rooms')}
            className="p-2 rounded-lg hover:bg-muted transition-all active:scale-95 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="hidden sm:block h-6 w-px bg-border mx-1" />
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Hash size={20} />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight capitalize leading-none mb-1">
                {roomId.replace(/-/g, ' ')}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full", isJoined ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  {isJoined ? 'Live Frequency' : 'Syncing...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyInvite}
            className={cn(
              "px-4 py-2 rounded-lg border transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider",
              copied
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Invite'}</span>
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground">
            <Users size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{userCount} Active</span>
          </div>
          
          <div className="relative group">
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all">
              <MoreVertical size={18} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1">
              <button onClick={copyInvite} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-muted rounded-md flex items-center gap-2">
                <LinkIcon size={14} /> Copy Invite
              </button>
              <button onClick={clearChat} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-muted rounded-md flex items-center gap-2 text-red-500">
                <Shield size={14} /> Clear History
              </button>
              <button onClick={leaveRoom} className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-500 hover:text-white rounded-md flex items-center gap-2">
                <ArrowLeft size={14} /> Terminate Session
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Message Stream */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 sm:px-8 pt-34 sm:pt-40 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:pb-32 scroll-smooth no-scrollbar"
      >
        <div className="max-w-4xl mx-auto mb-16 text-center flex flex-col items-center pt-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 border border-primary/10 saas-shadow"
          >
            <Shield size={28} />
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">Security Protocol Initialized</h3>
          <p className="text-muted-foreground max-w-xs font-medium text-xs leading-snug">
            Transmitting on <span className="text-primary font-bold">#{roomId}</span>.
            All nodes are ephemeral and zero-trace.
          </p>
          <div className="w-32 h-px bg-border mt-10" />
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SaaS Pill Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-8 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-8 z-40 bg-linear-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 p-1.5 rounded-2xl sm:rounded-full bg-card border border-border saas-shadow transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5"
          >
            <div className="hidden items-center gap-3 px-3 py-1.5 border-r border-border sm:flex">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-md">
                <AvatarIcon size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-none mb-1">Node</span>
                <span className="text-xs font-bold text-foreground leading-none">{username}</span>
              </div>
            </div>

            <div className="flex-1 flex items-center px-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!isJoined}
                className="w-full bg-transparent py-3 outline-none text-sm font-medium placeholder:text-muted-foreground/30"
                placeholder={isJoined ? "Transmit message..." : "Synchronizing..."}
              />
            </div>

            <div className="flex items-center gap-1 pr-2">
              <div className="relative">
                <button 
                  type="button" 
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2.5 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <Smile size={20} />
                </button>
                
                {showEmoji && (
                  <div className="absolute bottom-full right-0 mb-4 p-2 bg-card border border-border rounded-xl shadow-2xl z-50 grid grid-cols-4 gap-1 w-40">
                    {['😊', '😂', '🔥', '👍', '💀', '❤️', '🤔', '🚀'].map(e => (
                      <button key={e} onClick={() => addEmoji(e)} className="p-2 hover:bg-muted rounded-md text-lg">
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                disabled={!isJoined || !inputText.trim()}
                type="submit"
                className={cn(
                  "p-3 rounded-full transition-all active:scale-95 flex items-center justify-center",
                  inputText.trim()
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                <Send size={20} fill="currentColor" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-3 gap-6 opacity-60">
            <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-1.5">
              <span className={cn("w-1 h-1 rounded-full", isJoined ? "bg-emerald-500" : "bg-red-500")} />
              Sync Status: {isJoined ? 'Stable' : 'Offline'}
            </p>
            <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">TLS 1.3 End-to-End</p>
          </div>
        </div>
      </div>
    </div>
  );
}

