"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

export function ModelsBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    function handleMouseMove({ clientX, clientY }: { clientX: number, clientY: number }) {
      mouseX.set(clientX);
      mouseY.set(clientY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Moving Grid */}
      <div className="absolute inset-0 perspective-1000">
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.15] transform-gpu rotate-x-12 scale-150 origin-top"
          style={{
            backgroundSize: "40px 40px",
            backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
          }}
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
          `
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
    </div>
  );
}
