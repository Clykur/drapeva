"use client";

import { Gift } from "lucide-react";

export function PremiumPackaging() {
  return (
    <section className="gsap-section py-24 md:py-32 bg-background border-t border-border">
      <div className="container-luxe">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted/30 text-foreground">
              <Gift className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <p className="eyebrow mb-4">The Unboxing Experience</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6">
              Packaged With <br />
              <span className="font-serif italic font-light">Love & Care</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A Drapeva saree is a treasure, and its arrival should feel like opening a precious
              gift. Every saree is meticulously folded, wrapped in acid-free butter paper, and
              placed in our signature rigid keepsake box. Whether for yourself or a loved one, the
              experience is designed to delight.
            </p>

            <ul className="space-y-4 mb-10">
              {[
                "Signature Rigid Keepsake Box",
                "Acid-Free Tissue Wrapping",
                "Personalized Handwritten Note",
                "Saree Care Guide & Dust Bag",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-square md:aspect-[4/5] bg-muted/10">
            <img
              src="/images/saree_organza.png"
              alt="Premium packaging"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
