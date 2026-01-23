'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MOCK_FAQ } from '@/lib/data/hardcoded';

// Need to install accordion component
export function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-charcoal/70">Everything you need to know</p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {MOCK_FAQ.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-primary/10 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-charcoal hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-charcoal/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
