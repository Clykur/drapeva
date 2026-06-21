"use client";

import { ShieldCheck, Sparkles, Gem, Truck, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Gem,
    title: "Handpicked Quality",
    description:
      "Every saree is meticulously inspected for thread count, weave perfection, and dye consistency.",
  },
  {
    icon: Sparkles,
    title: "Authentic Craftsmanship",
    description:
      "Sourced directly from master weavers across India, preserving centuries-old weaving traditions.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description:
      "Your transactions are encrypted and protected. We guarantee the authenticity of every purchase.",
  },
  {
    icon: HeartHandshake,
    title: "Easy Exchanges",
    description:
      "A seamless 7-day return and exchange policy to ensure your complete satisfaction.",
  },
  {
    icon: Truck,
    title: "Global Delivery",
    description: "Fast, insured shipping worldwide with premium, secure packaging.",
  },
  {
    icon: Clock,
    title: "24/7 Concierge",
    description:
      "Personalized styling advice and order support from our dedicated luxury care team.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="gsap-section bg-background py-24 md:py-32 border-b border-border">
      <div className="container-luxe">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <p className="eyebrow mb-4">The Drapeva Standard</p>
          <h2 className="font-display text-3xl md:text-5xl">Why Women Choose Drapeva</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            We believe buying a saree should be as exquisite as wearing one. Experience the pinnacle
            of quality, trust, and service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="group relative">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-foreground transition-transform duration-500 group-hover:scale-110">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold mb-3 tracking-wide">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

              {/* Decorative line that grows on hover */}
              <div className="absolute -bottom-6 left-0 h-[1px] w-0 bg-foreground/20 transition-all duration-700 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
