"use client";

import { MessageCircle } from "lucide-react";

export function ConciergeService() {
  return (
    <section className="gsap-section py-24 md:py-32 bg-foreground text-background">
      <div className="container-luxe text-center max-w-4xl mx-auto">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background/10 text-background mb-8">
          <MessageCircle className="h-6 w-6" strokeWidth={1.5} />
        </div>

        <p className="eyebrow mb-4 text-background/60">Drapeva Concierge</p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8">
          Personalized Styling <br />
          <span className="font-serif italic font-light text-background/90">
            At Your Fingertips
          </span>
        </h2>

        <p className="text-background/80 leading-relaxed mb-12 max-w-2xl mx-auto text-lg">
          Not sure which Banarasi suits a day wedding? Looking for the perfect gift for your mother?
          Connect with our luxury styling experts on WhatsApp for personalized recommendations,
          drape styling tips, and custom assistance.
        </p>

        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-4 bg-background text-foreground px-8 py-5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-background/90 transition-all duration-300"
        >
          <span>Chat with a Stylist</span>
        </a>
      </div>
    </section>
  );
}
