'use client';

import Link from 'next/link';
import { Settings, MessageSquare, ShieldCheck, User, Bell, ChevronDown } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { AVATAR_ICONS } from '@/lib/avatars';
import { useState, useEffect } from 'react';
import { SettingsPanel } from '../settings/SettingsPanel';
import { PrivacyModal } from './PrivacyModal';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { username, avatar } = useUserStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const AvatarIcon = AVATAR_ICONS[avatar] || AVATAR_ICONS.User;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 z-[60] px-6 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl h-12 bg-card/80 backdrop-blur-md border border-border rounded-2xl px-4 flex items-center justify-between pointer-events-auto saas-shadow">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <MessageSquare size={16} fill="currentColor" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">Roomora</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => setShowPrivacy(true)}
                suppressHydrationWarning
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              >
                Security Protocol
              </button>
              <button suppressHydrationWarning className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                Global Nodes
              </button>
            </div>

            <div className="h-4 w-[1px] bg-border mx-1 hidden md:block" />

            {mounted && (
              <button 
                onClick={() => setShowSettings(true)}
                suppressHydrationWarning
                className="flex items-center gap-2 p-1.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all group"
              >
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[10px] font-medium text-muted-foreground leading-none mb-1">Identity</span>
                  <span className="text-xs font-semibold text-foreground leading-none">{username}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <AvatarIcon size={16} />
                </div>
                <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            )}
            
            <button 
              onClick={() => setShowSettings(true)}
              suppressHydrationWarning
              className="md:hidden p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground transition-colors"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </nav>

      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}

