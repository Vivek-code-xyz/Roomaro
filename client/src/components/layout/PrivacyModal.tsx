'use client';

import { X, ShieldAlert, Check, ShieldCheck, Lock, EyeOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col shadow-red-500/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-red-500/5 to-transparent">
              <div className="flex items-center gap-4 text-red-500">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Privacy <span className="text-red-500 text-2xl uppercase tracking-widest ml-2">Protocol</span></h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Legal Disclosure & Usage Safety</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl border border-white/5 text-slate-500 hover:text-white hover:bg-white/5 transition-all active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 space-y-10 text-slate-400 font-medium leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <p className="text-white font-black text-xl tracking-tight">
                  By accessing the Roomora network, you acknowledge the following secure transmission protocols:
                </p>

                <div className="space-y-6">
                  <PrivacyItem
                    icon={<EyeOff size={18} className="text-cyan-400" />}
                    title="Ephemeral Identity"
                    description="Roomora generates temporary node IDs. No identity data is persisted, but assume all transmissions are visible to present nodes."
                  />
                  <PrivacyItem
                    icon={<AlertTriangle size={18} className="text-red-400" />}
                    title="Zero Responsibility"
                    description="The architect is not liable for harmful, offensive, or unauthorized data shared within the frequencies."
                  />
                  <PrivacyItem
                    icon={<Lock size={18} className="text-cyan-400" />}
                    title="Data Sensitivity"
                    description="Never transmit PII (Personally Identifiable Information). All data shared is at the user's extreme risk."
                  />
                  <PrivacyItem
                    icon={<ShieldCheck size={18} className="text-emerald-400" />}
                    title="Moderation Engine"
                    description="As an autonomous, p2p-simulated layer, moderation is absent. Exercise individual discretion."
                  />
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 italic text-xs text-slate-500 bg-gradient-to-r from-white/[0.01] to-transparent">
                Note: Roomora is a technical orchestration project. It does not warrant legal immunity or military-grade encryption for shared content. Use with professional caution.
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 md:p-12 border-t border-white/5 bg-gradient-to-tr from-white/[0.02] to-transparent">
              <button
                onClick={onClose}
                className="w-full px-12 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
              >
                <Check size={24} />
                Acknowledge Protocol
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function PrivacyItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">{title}</h4>
        <p className="text-sm leading-snug">{description}</p>
      </div>
    </div>
  );
}

