import React from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
};

export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}>
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2 className="landing-section-title">{title}</h2>
      <p className="landing-section-subtitle">{subtitle}</p>
    </div>
  );
}
