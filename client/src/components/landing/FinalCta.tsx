import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="px-6 pb-20 pt-10">
      <div className="landing-container">
        <div className="landing-cta-shell">
          <p className="landing-eyebrow">Ready to launch</p>
          <h2 className="landing-section-title max-w-2xl">
            Build your next high-trust conversation room in under a minute
          </h2>
          <p className="landing-section-subtitle max-w-xl">
            Whether you are coordinating an incident, a launch, or a strategic discussion,
            Roomora keeps communication fast, private, and aligned.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/rooms" className="landing-btn-primary">
              Go To Rooms
              <ArrowRight size={16} />
            </Link>
            <a href="#features" className="landing-btn-secondary">
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
