import { Quote } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const testimonials = [
  {
    quote:
      'We use Roomora for launch-night command rooms. Setup is instant and the UI keeps people on-task.',
    name: 'Nina Park',
    role: 'Product Lead, Northline Labs',
  },
  {
    quote:
      'I needed a private space for candidate debriefs across hiring managers. Roomora became our default.',
    name: 'Aditya Rao',
    role: 'Talent Partner, Serif Works',
  },
  {
    quote:
      'The no-login model is perfect for short-term client war rooms during campaign weeks.',
    name: 'Marcos Bell',
    role: 'Founder, Brightline Studio',
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-6 py-18 md:py-24" id="testimonials">
      <div className="landing-container space-y-10">
        <SectionHeading
          eyebrow="Social proof"
          title="Teams trust Roomora when conversations matter"
          subtitle="From internal triage to external collaboration, Roomora supports serious workflows without heavy setup."
          align="center"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="landing-quote-card">
              <Quote size={18} className="text-primary" />
              <p>{item.quote}</p>
              <div>
                <h3>{item.name}</h3>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
