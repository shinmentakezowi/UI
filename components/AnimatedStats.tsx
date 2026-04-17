"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function useCountUp(target: number, duration: number, started: boolean, decimals: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf: number;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();
}

interface StatItemProps {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  delay?: number;
}

function StatItem({ target, prefix = "", suffix = "", decimals = 0, label, delay = 0 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const display = useCountUp(target, 1400, started, decimals);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-1 tabular-nums">
        {prefix}{display}{suffix}
      </div>
      <div className="text-[10px] text-zinc-600 tracking-widest font-medium uppercase">{label}</div>
    </div>
  );
}

export function AnimatedStats() {
  const t = useTranslations("stats");

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
      <StatItem target={100} suffix="+" label={t("models")}    delay={0}   />
      <StatItem target={10}  suffix="+" label={t("providers")} delay={150} />
      <StatItem target={99.9} suffix="%" decimals={1} label={t("uptime")} delay={300} />
      <StatItem prefix="<" target={50} suffix="ms" label={t("latency")} delay={450} />
    </div>
  );
}
