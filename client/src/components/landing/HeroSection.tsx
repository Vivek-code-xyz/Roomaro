'use client';

import Link from 'next/link';
import { ArrowRight, Play, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const metrics = [
  { label: 'Active rooms', value: '12.4k' },
  { label: 'Avg. room lifetime', value: '23m' },
  { label: 'Messages/day', value: '2.8M' },
];

export function HeroSection() {
  return (
    <section className="landing-hero px-6 pt-28 pb-14 md:pb-24">
      <div className="landing-container grid gap-10 items-center lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase text-primary">
            <Sparkles size={14} />
            Built For Focused Conversations
          </div>

          <h1 className="landing-hero-title mt-6">
            Private Rooms for Teams Who Move Fast and Share Sensitive Context
          </h1>

          <p className="landing-hero-subtitle mt-5 max-w-xl">
            Roomora gives your team instant, anonymous collaboration spaces with real-time sync,
            sharp moderation tools, and zero account friction.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/rooms" className="landing-btn-primary">
              Start A Room
              <ArrowRight size={16} />
            </Link>
            <button className="landing-btn-secondary" type="button">
              <Play size={16} />
              Watch 90s Demo
            </button>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {metrics.map((item) => (
              <div key={item.label} className="landing-metric-card">
                <p className="landing-metric-value">{item.value}</p>
                <p className="landing-metric-label">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="landing-orbit-card min-h-75 sm:min-h-90 lg:min-h-105"
        >
          <div className="landing-orbit-grid" />
          <div className="relative z-10 space-y-4">
            <div className="rounded-2xl border border-border bg-card/95 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Live security</p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">End-to-end transport</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  <Shield size={12} />
                  Verified
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/95 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Room pulse</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: '84%' }}
                  transition={{ duration: 1.4, repeat: Infinity, repeatType: 'reverse' }}
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">84% lower setup friction vs. invite-only tools.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card/95 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Operator mode</p>
              <p className="mt-3 text-sm font-medium text-foreground">
                Create temporary channels for launches, incidents, recruiting loops, and client war rooms.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
