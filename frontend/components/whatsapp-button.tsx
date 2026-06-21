"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      // Check if we're at the top (hero section) on the homepage
      const isAtHero = pathname === "/" && window.scrollY < window.innerHeight - 150;

      // Check if we've scrolled to the footer (within 300px of the bottom)
      const isAtFooter =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;

      // Check if we're in the admin portal
      const isAdmin = pathname?.startsWith("/admin");

      if (isAtHero || isAtFooter || isAdmin) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    // Also re-check on resize since scrollHeight/innerHeight changes
    window.addEventListener("resize", toggleVisibility, { passive: true });

    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("resize", toggleVisibility);
    };
  }, [pathname]);

  return (
    <a
      href="https://wa.me/919800000000"
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"}`}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-5 w-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
