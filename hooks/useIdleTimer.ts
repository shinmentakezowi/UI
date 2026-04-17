"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT = 240 * 60 * 1000; // 240 minutes
const EVENTS: (keyof WindowEventMap)[] = ["mousemove", "keydown", "touchstart"];

export function useIdleTimer() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/login";
      }, IDLE_TIMEOUT);
    }

    resetTimer();

    for (const event of EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, []);
}
