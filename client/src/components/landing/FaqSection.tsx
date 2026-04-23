import { SectionHeading } from './SectionHeading';

const faqs = [
  {
    question: 'Do users need to create accounts?',
    answer: 'No. Roomora is designed for instant entry with lightweight identity options.',
  },
  {
    question: 'Can we use this for client collaboration?',
    answer: 'Yes. Teams often create room links for agencies, clients, or temporary partners.',
  },
  {
    question: 'Does it work well on mobile?',
    answer: 'Yes. The interface is responsive and optimized for quick reading and posting on small screens.',
  },
  {
    question: 'Is Roomora suitable for incident response?',
    answer: 'Absolutely. It is great for high-speed coordination during launches and operational events.',
  },
];

export function FaqSection() {
  return (
    <section className="px-6 py-18 md:py-24" id="faq">
      <div className="landing-container space-y-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Answers for teams adopting Roomora"
          subtitle="If you are replacing slower tools with faster room-based collaboration, start here."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <article className="landing-faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
