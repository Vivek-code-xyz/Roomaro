import { Clock3, LockKeyhole, Workflow } from 'lucide-react';

const points = [
  {
    icon: LockKeyhole,
    title: 'Anonymous by default',
    text: 'No email, no account creation, no profile indexing.',
  },
  {
    icon: Clock3,
    title: 'Live in seconds',
    text: 'Create and share a room link in less than 10 seconds.',
  },
  {
    icon: Workflow,
    title: 'Structured collaboration',
    text: 'Use dedicated rooms for standups, handoffs, and incident response.',
  },
];

export function ValueStrip() {
  return (
    <section className="px-6 pb-6">
      <div className="landing-container grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <article key={point.title} className="landing-value-card">
            <point.icon size={18} className="text-primary" />
            <h3>{point.title}</h3>
            <p>{point.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
