"use client";

import { useEffect, useCallback } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="-10.5 -9.45 21 18.9" fill="currentColor" {...props}>
    <circle cx="0" cy="0" r="2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1" fill="none">
      <ellipse rx="10" ry="4.5" />
      <ellipse rx="10" ry="4.5" transform="rotate(60)" />
      <ellipse rx="10" ry="4.5" transform="rotate(120)" />
    </g>
  </svg>
);

const TypeScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <path d="M6 6h36v36H6z" fill="currentColor" fillOpacity="0.1" />
    <text x="24" y="34" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="currentColor" textAnchor="middle">TS</text>
  </svg>
);

const PythonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <text x="24" y="34" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="currentColor" textAnchor="middle">PY</text>
  </svg>
);

const GoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <text x="12" y="16" fontSize="14" fontWeight="bold" fill="currentColor" textAnchor="middle">GO</text>
  </svg>
);

const RustIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const DockerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 14H5V11H2V14ZM6 14H9V11H6V14ZM10 14H13V11H10V14ZM14 14H17V11H14V14ZM6 10H9V7H6V10ZM10 10H13V7H10V10ZM14 10H17V7H14V10ZM10 6H13V3H10V6Z" fill="currentColor" />
    <path d="M2 16H22C22 16 21 21 12 21C3 21 2 16 2 16Z" fill="currentColor" fillOpacity="0.3" />
  </svg>
);

const GitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 8V16M6 12H10L18 12" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const JavaScriptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" fill="currentColor" {...props}>
    <path d="M6 6h36v36H6z" fill="currentColor" fillOpacity="0.1" />
    <text x="24" y="34" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="currentColor" textAnchor="middle">JS</text>
  </svg>
);

const CppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 8L2 12L6 16M18 8L22 12L18 16M14.5 4L9.5 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SwiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4C8 4 8 10 14 10C20 10 21 5 21 5C21 5 20 14 15 17C10 20 4 18 4 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const icons = [
  { Icon: ReactIcon, color: "text-blue-400", size: 50, top: "10%", left: "5%", delay: 0 },
  { Icon: TypeScriptIcon, color: "text-blue-600", size: 45, top: "20%", right: "8%", delay: 1.5 },
  { Icon: JavaScriptIcon, color: "text-yellow-400", size: 50, top: "60%", left: "8%", delay: 3 },
  { Icon: PythonIcon, color: "text-green-500", size: 60, bottom: "15%", right: "12%", delay: 2 },
  { Icon: RustIcon, color: "text-orange-600", size: 40, top: "30%", left: "60%", delay: 0.5 },
  { Icon: GoIcon, color: "text-cyan-400", size: 55, bottom: "10%", left: "40%", delay: 2.2 },
  { Icon: DockerIcon, color: "text-blue-500", size: 55, top: "50%", right: "45%", delay: 2.8 },
  { Icon: GitIcon, color: "text-red-500", size: 40, top: "15%", left: "80%", delay: 1.2 },
  { Icon: CppIcon, color: "text-blue-500", size: 45, bottom: "40%", right: "25%", delay: 3.5 },
  { Icon: SwiftIcon, color: "text-orange-400", size: 45, top: "5%", left: "40%", delay: 1.8 },
] as const;

function FloatingLogos() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.color} opacity-[0.05] blur-[0px] hover:opacity-30 hover:blur-0 transition-all duration-500`}
          style={{
            top: "top" in item ? item.top : undefined,
            left: "left" in item ? item.left : undefined,
            right: "right" in item ? item.right : undefined,
            bottom: "bottom" in item ? item.bottom : undefined,
            width: item.size,
            height: item.size,
          }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          <item.Icon className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
}

export function HeroBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Moving Grid (wiwi style) */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-grid-white opacity-[0.15] transform-gpu rotate-x-12 scale-150 origin-top"
        />
      </div>

      {/* Dynamic Spotlights */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />

      {/* Bottom fade to page bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />

      {/* Floating Icons */}
      <FloatingLogos />
    </div>
  );
}
