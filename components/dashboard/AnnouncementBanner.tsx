"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";

interface Announcement {
  content: string;
  publishDate: string;
  type?: "default" | "ongoing" | "success" | "warning" | "error";
  extra?: string;
}

const TYPE_BAR: Record<string, string> = {
  warning: "bg-amber-400/80",
  error: "bg-red-400/80",
  success: "bg-emerald-400/80",
  ongoing: "bg-violet-400/80",
  default: "bg-blue-400/80",
};

const STORAGE_KEY = "announcements_read_at";

function getReadAt(): number {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function markRead(announcements: Announcement[]) {
  if (announcements.length === 0) return;
  // Store the latest announcement's publishDate timestamp
  const latest = Math.max(
    ...announcements.map((a) => new Date(a.publishDate).getTime())
  );
  localStorage.setItem(STORAGE_KEY, String(latest));
}

export function AnnouncementBanner() {
  const t = useTranslations("dashboard");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [readAt, setReadAt] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadAt(getReadAt());
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.announcements)) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-open if there are unread announcements
  useEffect(() => {
    if (autoOpened || announcements.length === 0) return;
    const savedReadAt = getReadAt();
    const hasUnread = announcements.some(
      (a) => new Date(a.publishDate).getTime() > savedReadAt
    );
    if (hasUnread) {
      setAutoOpened(true);
      const timer = setTimeout(() => {
        updatePos();
        setOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [announcements, autoOpened]);

  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // Position: below the button, aligned to its left edge
    setPos({ top: rect.bottom + 6, left: rect.left });
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (panelRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", updatePos);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  useEffect(() => {
    if (open && announcements.length > 0) {
      markRead(announcements);
      const latest = Math.max(
        ...announcements.map((a) => new Date(a.publishDate).getTime())
      );
      setReadAt(latest);
    }
  }, [open, announcements]);

  function formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMs / 3600000);
      const diffDay = Math.floor(diffMs / 86400000);

      if (diffMin < 1) return t("justNow");
      if (diffMin < 60) return t("minutesAgo", { count: diffMin });
      if (diffHour < 24) return t("hoursAgo", { count: diffHour });
      if (diffDay < 7) return t("daysAgo", { count: diffDay });
      return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }

  function handleToggle() {
    if (!open) updatePos();
    setOpen(!open);
  }

  if (announcements.length === 0) return null;

  const unreadCount = announcements.filter(
    (a) => new Date(a.publishDate).getTime() > readAt
  ).length;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="relative p-1 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors duration-200 cursor-pointer"
        aria-label={t("announcements")}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-violet-500 text-[10px] font-semibold text-white flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <>
            {isMobile && (
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
                onClick={() => setOpen(false)}
                style={{ animation: "ann-fadeIn 0.15s ease-out both" }}
              />
            )}

            <div
              ref={panelRef}
              className="fixed z-50"
              style={
                isMobile
                  ? { inset: "auto 0 0 0" }
                  : pos
                    ? { top: pos.top, left: pos.left }
                    : undefined
              }
            >
              <div
                className={`
                  bg-[#111111] border border-white/[0.08] overflow-hidden
                  ${isMobile ? "rounded-t-2xl" : "rounded-xl w-[340px]"}
                `}
                style={{
                  animation: isMobile
                    ? "ann-slideUp 0.2s ease-out both"
                    : "ann-fadeIn 0.12s ease-out both",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                {/* Header */}
                <div className="px-3.5 py-2.5 border-b border-white/[0.06]">
                  <span className="text-[13px] font-medium text-zinc-200">{t("announcements")}</span>
                </div>

                {/* List */}
                <div
                  className="overflow-y-auto overscroll-contain"
                  style={{ maxHeight: isMobile ? "60vh" : "min(320px, 60vh)" }}
                >
                  {announcements.map((a, i) => {
                    const bar = TYPE_BAR[a.type || "default"] || TYPE_BAR.default;
                    const isUnread = new Date(a.publishDate).getTime() > readAt;
                    return (
                      <div
                        key={i}
                        className={`relative ${i > 0 ? "border-t border-white/[0.04]" : ""}`}
                      >
                        {isUnread && (
                          <div className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full ${bar}`} />
                        )}
                        <div className="px-3.5 py-2.5">
                          <p
                            className={`text-[13px] leading-[1.5] ${isUnread ? "text-zinc-200" : "text-zinc-500"}`}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {a.content}
                          </p>
                          {a.extra && (
                            <p
                              className="text-[11px] text-zinc-500 mt-1 leading-[1.4]"
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {a.extra}
                            </p>
                          )}
                          <span className="text-[11px] text-zinc-600 mt-1 block">
                            {formatDate(a.publishDate)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>,
          document.body
        )}

      <style jsx global>{`
        @keyframes ann-fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ann-slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes ann-fadeIn { from { opacity: 1; transform: none; } }
          @keyframes ann-slideUp { from { transform: none; } }
        }
      `}</style>
    </>
  );
}
