"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function FloatingBackButton() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.history.length > 1);
  }, []);

  if (!show) return null;

  return (
    <button
      aria-label="Go back"
      onClick={() => router.back()}
      className="fixed top-20 left-6 z-40 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-100 transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      Back
    </button>
  );
}
