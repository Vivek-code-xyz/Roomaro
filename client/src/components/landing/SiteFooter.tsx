import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/70 px-6 py-8">
      <div className="landing-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <MessageSquare size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Roomora</p>
            <p className="text-xs text-muted-foreground">Private real-time communication rooms</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">© 2026 Roomora, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
