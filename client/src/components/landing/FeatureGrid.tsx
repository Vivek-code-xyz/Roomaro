import { Globe2, Layers3, ShieldCheck, SlidersHorizontal, Sparkles, Zap } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const features = [
  {
    icon: ShieldCheck,
    title: 'Privacy architecture',
    text: 'Conversations are designed to be transient with minimal retention surfaces.',
  },
  {
    icon: Zap,
    title: 'Fast real-time transport',
    text: 'Socket-based messaging tuned for low-latency interactions in distributed teams.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Room-level controls',
    text: 'Set room mood, identity style, and moderation behavior in one place.',
  },
  {
    icon: Layers3,
    title: 'Multi-room workflows',
    text: 'Spin up parallel rooms for triage, planning, and execution without context loss.',
  },
  {
    icon: Globe2,
    title: 'Global access',
    text: 'Share links instantly with remote collaborators across time zones.',
  },
  {
    icon: Sparkles,
    title: 'Frictionless UX',
    text: 'A clean interface focused on message clarity and momentum.',
  },
];

export function FeatureGrid() {
  return (
    <section className="px-6 py-18 md:py-24" id="features">
      <div className="landing-container space-y-10">
        <SectionHeading
          eyebrow="Core capabilities"
          title="Everything you need for private, high-velocity team chat"
          subtitle="From instant room creation to clean moderation controls, Roomora is designed for teams who want less setup and more action."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="landing-feature-card">
              <div className="landing-feature-icon">
                <feature.icon size={20} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
