const fs = require("fs");
let code = fs.readFileSync("app/page.tsx", "utf8");

// Replace styles
code = code.replace(/text-gold/g, "text-foreground");
code = code.replace(/bg-champagne\/([0-9]+)/g, "bg-muted/10");
code = code.replace(/bg-champagne/g, "bg-muted");
code = code.replace(
  /<span className="gold-divider" \/>/g,
  '<span className="border-t-2 border-foreground w-8 inline-block" />',
);
code = code.replace(/gold-divider/g, "border-t-2 border-foreground w-8 inline-block");
code = code.replace(/shimmer-text/g, "text-foreground font-black tracking-tighter");
code = code.replace(/border-gold/g, "border-foreground");
code = code.replace(/hover:text-gold/g, "hover:text-muted-foreground");
code = code.replace(/hover:border-gold/g, "hover:border-foreground");
code = code.replace(/fill-gold/g, "fill-foreground");

// Add GSAP imports
const gsapImports = `import gsap from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";\nimport { useGSAP } from "@gsap/react";\n\nif (typeof window !== "undefined") {\n  gsap.registerPlugin(ScrollTrigger);\n}\n`;
code = code.replace(
  'import { useState, useEffect } from "react";',
  `import { useState, useEffect, useRef } from "react";\n${gsapImports}`,
);

// Add GSAP hook in PublicHome
const publicHomeStart = `function PublicHome() {`;
const publicHomeGSAP = `function PublicHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const sections = gsap.utils.toArray('.gsap-section');
    sections.forEach((section: any) => {
      gsap.fromTo(section, 
        { y: 50, opacity: 0 }, 
        { 
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
    });
  }, { scope: containerRef });
`;
code = code.replace(publicHomeStart, publicHomeGSAP);

// Wrap PublicHome return in containerRef
code = code.replace("return (", "return (\n    <div ref={containerRef}>");
code = code.replace(/<\/div>\n  \);\n}\n\n\/\/ ===+/g, "    </div>\n  </div>\n  );\n}\n\n// ====");

// Add className="gsap-section" to sections in PublicHome
code = code.replace(
  /<section data-hero-section className="/g,
  '<section data-hero-section className="gsap-section ',
);
code = code.replace(/<section className="/g, '<section className="gsap-section ');

fs.writeFileSync("app/page.tsx", code);
