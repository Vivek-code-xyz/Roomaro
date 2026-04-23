'use client'

import { Navbar } from '@/components/layout/Navbar';
import { useSocket } from '@/hooks/useSocket';
import { useRoomStore, RoomInfo } from '@/store/useRoomStore';
import { useUserStore } from '@/store/useUserStore';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Users, Shuffle, MessageSquare, ArrowRight, History, Zap, X, Terminal, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { shuffleArray, cn } from '@/lib/utils';

export default function RoomsPage() {
  const socket = useSocket();
  const router = useRouter();
  const { roomList, setRoomList } = useRoomStore();
  const { recentRooms } = useUserStore();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleRoomListUpdate = (rooms: RoomInfo[]) => {
      setRoomList(rooms);
    };

    const handleError = (err: { message: string }) => {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    };

    socket.on('room_list_update', handleRoomListUpdate);
    socket.on('error', handleError);
    socket.emit('get_rooms');

    return () => {
      socket.off('room_list_update', handleRoomListUpdate);
      socket.off('error', handleError);
    };
  }, [socket, setRoomList]);

  const filteredRooms = useMemo(() => {
    let list = [...roomList];
    if (isShuffled) {
      list = shuffleArray(list);
    }
    return list.filter(room =>
      room.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [roomList, isShuffled, search]);

  const activeRecentRooms = useMemo(() => {
    return recentRooms
      .map(name => roomList.find(r => r.name === name))
      .filter((r): r is RoomInfo => !!r);
  }, [recentRooms, roomList]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const normalized = newRoomName.trim().toLowerCase().replace(/\s+/g, '-');
    socket?.emit('create_room', normalized);
    router.push(`/room/${normalized}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-22 sm:pt-24 pb-16 sm:pb-20">
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Cpu size={12} />
              Node Directory
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Active <span className="text-primary italic">Frequencies</span>
            </h1>
            <p className="text-muted-foreground max-w-sm font-medium text-base leading-snug">
              Connect to an existing node or forge a new private channel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                suppressHydrationWarning
                className="pl-11 pr-6 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none w-full sm:w-64 transition-all font-medium placeholder:text-muted-foreground/50 saas-shadow"
              />
            </div>

            <button
              onClick={() => setIsShuffled(!isShuffled)}
              suppressHydrationWarning
              className={cn(
                "p-3 rounded-xl border transition-all active:scale-95 saas-shadow",
                isShuffled ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:bg-muted"
              )}
            >
              <Shuffle size={18} />
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              suppressHydrationWarning
              className="px-4 sm:px-6 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Forge Room
            </button>
          </div>
        </header>

        {/* Recently Joined */}
        {mounted && (
          <AnimatePresence>
            {activeRecentRooms.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <div className="flex items-center gap-2 mb-6">
                  <History className="text-muted-foreground" size={14} />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Nodes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeRecentRooms.map(room => (
                    <Link
                      key={room.name}
                      href={`/room/${room.name}`}
                      className="saas-card group p-5 hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Zap size={16} fill="currentColor" />
                        </div>
                        <span className="text-[9px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 uppercase tracking-tighter">Connected</span>
                      </div>
                      <h3 className="text-base font-bold truncate text-foreground mb-1">{room.name}</h3>
                      <p className="text-[11px] text-muted-foreground font-medium">{room.userCount} Nodes Pulse</p>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}

        <div className="flex items-center gap-2 mb-6">
          <Users className="text-muted-foreground" size={14} />
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Streams</h2>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-4xl bg-muted/30 border border-dashed border-border saas-shadow">
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center text-muted-foreground mb-6 border border-border">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">The network is silent</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
              No matching frequencies found. Start your own broadcast node.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold border border-primary/20 hover:bg-primary/90 transition-all saas-shadow"
            >
              Initialize Node
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room.name}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Link
                    href={`/room/${room.name}`}
                    className="saas-card group p-6 flex flex-col hover:border-primary/40 h-full"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                        <Users size={12} />
                        {room.userCount}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 truncate text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {room.name.replace(/-/g, ' ')}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">#{room.name}</span>
                      <div className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                        Connect
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modernized SaaS Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-6 right-6 p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Forge New Node</h2>
                <p className="text-muted-foreground font-medium text-sm leading-snug">Initialize a unique frequency for ephemeral communication.</p>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Designation</label>
                  <div className="relative group">
                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      autoFocus
                      type="text"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="w-full pl-11 pr-6 py-4 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-semibold placeholder:text-muted-foreground/30"
                      placeholder="Frequency name..."
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-destructive text-[11px] font-bold flex items-center gap-1.5 px-1 mt-2"
                    >
                      <X size={12} className="border border-destructive rounded-full p-0.5" />
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-4 bg-muted text-muted-foreground rounded-xl font-bold text-sm hover:bg-muted/80 transition-all border border-border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                  >
                    Forge Protocol
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

