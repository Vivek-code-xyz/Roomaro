'use client';

import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, font } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Remove old classes
    const classes = ['light', 'dark', 'grey', 'ocean', 'sunset'];
    document.documentElement.classList.remove(...classes);

    // Add current classes
    document.documentElement.classList.add(theme);

    // Also update body fonts for good measure
    const fontClasses = ['font-inter', 'font-roboto', 'font-outfit', 'font-mono', 'font-serif'];
    document.body.classList.remove(...fontClasses);
    document.body.classList.add(`font-${font}`);
  }, [theme, font, mounted]);

  // Prevent flash by not rendering children until mounted
  // (Alternatively, show a minimal loader or just the background)
  if (!mounted) {
    return (
      <div className="bg-black min-h-screen">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
