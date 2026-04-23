import { Check, CircleDot, Link2, MessagesSquare, Rocket } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const steps = [
  {
    icon: CircleDot,
    title: 'Create a room',
    text: 'Generate a room instantly with your preferred identity and moderation settings.',
  },
  {
    icon: Link2,
    title: 'Share secure link',
    text: 'Invite teammates or clients without account setup friction.',
  },
  {
    icon: MessagesSquare,
    title: 'Collaborate live',
    text: 'Discuss ideas, incidents, or plans with real-time message sync.',
  },
  {
    icon: Rocket,
    title: 'Ship and close',
    text: 'Wrap the room when complete and keep your workflow focused.',
  },
];

const checklist = [
  'Anonymous room joins',
  'Quick theme and avatar control',
  'Built-in moderation panel',
  'Clean, mobile-friendly reading experience',
];

export function HowItWorks() {
  return (
    <section className="px-6 py-18 md:py-24" id="how-it-works">
      <div className="landing-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="How it works"
            title="Launch focused conversations in four simple steps"
            subtitle="Roomora was built for operating rhythm: open fast, align clearly, close with confidence."
          />

          <div className="mt-8 space-y-4">
            {steps.map((step, index) => (
              <article key={step.title} className="landing-step-card">
                <div className="landing-step-index">0{index + 1}</div>
                <div className="landing-step-content">
                  <div className="landing-step-title-row">
                    <step.icon size={16} className="text-primary" />
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="landing-check-panel">
          <h3>Operational checklist</h3>
          <p>
            Ready-to-use defaults make Roomora ideal for product teams, startups, agencies,
            and distributed operators.
          </p>
          <ul>
            {checklist.map((item) => (
              <li key={item}>
                <Check size={14} />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
