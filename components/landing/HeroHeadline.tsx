"use client";

import { GlitchText, TypewriterText } from "./GlitchText";

export function HeroHeadline({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
        <TypewriterText text={line1} delay={0.3} />
        <br />
        <GlitchText
          text={line2}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black"
        />
      </h1>
    </div>
  );
}
