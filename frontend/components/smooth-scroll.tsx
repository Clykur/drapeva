"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function ScrollController() {
  const pathname = usePathname();
  const lenis = useLenis();
  const isInitialMount = useRef(true);

  // Save scroll position before reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-pos-${pathname}`, window.scrollY.toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // On initial load, check if we have a saved scroll position for this path
      const savedPos = sessionStorage.getItem(`scroll-pos-${pathname}`);
      if (savedPos && lenis) {
        // Use requestAnimationFrame to ensure the DOM has rendered enough
        requestAnimationFrame(() => {
          lenis.scrollTo(Number(savedPos), { immediate: true });
        });
      }
      return;
    }

    // Force scroll to top instantly on route change
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ScrollController />
      {children}
    </ReactLenis>
  );
}
