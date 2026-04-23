'use client';

import { useUserStore, ThemeType, FontType } from '@/store/useUserStore';
import { AVATAR_ICONS, avatarList, AvatarType } from '@/lib/avatars';
import { X, Check, AlertCircle, Fingerprint, Palette, Type, User, Zap, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { 
    username, setUsername, 
    avatar: currentAvatar, setAvatar,
    theme, setTheme,
    font, setFont,
    avatarChanges
  } = useUserStore();

  const [nameInput, setNameInput] = useState(username);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'identity' | 'appearance'>('identity');

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
    }
  };

  const handleAvatarChange = (avatar: AvatarType) => {
    const result = setAvatar(avatar);
    if (!result.success) {
      setError(result.error || 'Unknown error');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.98, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 10 }}
            className="relative w-full max-w-xl h-auto max-h-[90vh] bg-card border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col saas-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight mb-0.5">Control <span className="text-primary italic">Panel</span></h2>
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  <Terminal size={12} />
                  Node Identifier: {username}
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all active:scale-95 hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Inner Tabs */}
            <div className="flex border-b border-border bg-muted/5 p-1 mx-6 mt-6 rounded-xl">
              <button 
                onClick={() => setActiveTab('identity')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2",
                  activeTab === 'identity' ? "bg-card text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User size={14} /> Identity
              </button>
              <button 
                onClick={() => setActiveTab('appearance')}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2",
                  activeTab === 'appearance' ? "bg-card text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Palette size={14} /> Appearance
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'identity' ? (
                  <motion.div
                    key="identity"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Identity Section */}
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Fingerprint size={14} className="text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Callsign</h3>
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onBlur={handleSaveName}
                          suppressHydrationWarning
                          className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground font-bold text-base placeholder:text-muted-foreground/30 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                          placeholder="Enter designation..."
                        />
                      </div>
                    </section>

                    {/* Avatar Grid */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-primary" />
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visual Manifest</h3>
                        </div>
                        <div className="px-2 py-0.5 bg-muted/50 border border-border rounded-md text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          {avatarChanges.count}/5
                        </div>
                      </div>
                      
                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-bold flex items-center gap-2">
                          <AlertCircle size={12} />
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-8 gap-2">
                        {avatarList.map((id) => {
                          const Icon = AVATAR_ICONS[id] || AVATAR_ICONS.User;
                          const isSelected = currentAvatar === id;
                          return (
                            <button
                              key={id}
                              onClick={() => handleAvatarChange(id)}
                              className={cn(
                                "aspect-square rounded-lg flex items-center justify-center border transition-all active:scale-95",
                                isSelected 
                                  ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
                                  : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30 hover:text-primary"
                              )}
                            >
                              <Icon size={16} />
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  </motion.div>
                ) : (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                  >
                    {/* Theme Palette */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Palette size={14} className="text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Luminescence</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['dark', 'light', 'grey', 'ocean', 'sunset'] as ThemeType[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all active:scale-95 capitalize",
                              theme === t 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-muted/20 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Typography */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Type size={14} className="text-primary" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Typography</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['inter', 'roboto', 'outfit', 'mono', 'serif'] as FontType[]).map((f) => (
                          <button
                            key={f}
                            onClick={() => setFont(f)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 capitalize",
                              `font-${f}`,
                              font === f 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-muted/20 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border flex items-center justify-between bg-muted/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none mb-1">Status</span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 leading-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synchronized
                </span>
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
              >
                <Check size={16} />
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

