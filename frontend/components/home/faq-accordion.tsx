"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I know the silk is authentic?",
    answer:
      "Every pure silk saree from Drapeva comes with a Silk Mark Certification from the Silk Mark Organisation of India, guaranteeing 100% natural silk.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship globally using premium courier partners like DHL and FedEx. International orders typically arrive within 5-7 business days.",
  },
  {
    question: "Can I exchange my saree if I don't like it?",
    answer:
      "Absolutely. We offer a seamless 7-day exchange policy. If the saree doesn't match your expectations, we will arrange a pickup and help you find the perfect alternative.",
  },
  {
    question: "Do you offer blouse stitching services?",
    answer:
      "Currently, we provide unstitched blouse pieces with our sarees. We recommend consulting your trusted local tailor for the perfect fit.",
  },
  {
    question: "How should I care for my Drapeva silk saree?",
    answer:
      "We recommend dry cleaning only for all our pure silk sarees. Store them in the provided breathable dust bag, folded carefully. Change the folds every few months to prevent creasing.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="gsap-section py-24 md:py-32 bg-muted/5">
      <div className="container-luxe max-w-4xl">
        <div className="text-center mb-16">
          <p className="eyebrow mb-4">Support</p>
          <h2 className="font-display text-3xl md:text-5xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border-b border-border overflow-hidden transition-all duration-500 ${isOpen ? "bg-background" : ""}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-6 px-4 md:px-8 text-left hover:text-foreground/70 transition-colors"
                >
                  <span className="font-display text-xl md:text-2xl">{faq.question}</span>
                  <div
                    className={`shrink-0 ml-4 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                  >
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-8 px-4 md:px-8 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
