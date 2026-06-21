"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FounderStory() {
  return (
    <section className="gsap-section py-24 md:py-32 bg-background border-b border-border">
      <div className="container-luxe">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <p className="eyebrow mb-6">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1]">
              "Sarees are not just garments; they are heirlooms of art."
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                When I started Drapeva, my vision was simple: to bring the breathtaking
                craftsmanship of authentic Indian weavers to the modern woman without compromising
                on trust, quality, or elegance.
              </p>
              <p>
                Every weave you find here has been personally vetted for quality. We don't just sell
                sarees; we preserve stories, celebrate artisans, and ensure that when you wear
                Drapeva, you feel an undeniable sense of grace and empowerment.
              </p>
            </div>
            <div className="mt-12">
              <Link
                href="/about"
                className="group inline-flex items-center gap-4 border-b border-foreground pb-2 text-xs tracking-[0.2em] uppercase font-semibold hover:text-foreground/70 transition-colors"
              >
                <span>Read the full story</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="aspect-[4/5] overflow-hidden bg-muted/10">
              <img
                src="/images/saree_founder.png"
                alt="Founder of Drapeva"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
