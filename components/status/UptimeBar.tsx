"use client";

import { useState, useRef, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle } from "lucide-react";

interface CheckData {
  time: string; // ISO timestamp
  status: string; // "operational" | "degraded" | "down"
}

interface BucketData {
  key: string; // "2026-04-03T17:15" Beijing time
  status: string; // "operational" | "partial" | "degraded" | "down" | "nodata"
  checks: CheckData[];
  avgMs: number | null;
}

interface UptimeBarProps {
  buckets: BucketData[];
  locale: string;
}

// 4-level bar colors — muted for dark bg, green→yellow→orange→red scale
const BAR_COLORS: Record<string, string> = {
  operational: "bg-[#3bb44a]",   // 3/3 green
  partial: "bg-[#85b836]",      // 2/3 olive-green
  degraded: "bg-[#e5a035]",     // 2-3 degraded, amber
  major: "bg-[#ee7b31]",        // 2/3 down, orange-red
  down: "bg-[#d94545]",         // 3/3 down, red
};

// Status styles for tooltip icons
const STATUS_STYLES = {
  operational: { Icon: CheckCircle2, color: "text-emerald-400", dot: "bg-emerald-400" },
  degraded: { Icon: AlertTriangle, color: "text-amber-400", dot: "bg-amber-400" },
  down: { Icon: XCircle, color: "text-red-400", dot: "bg-red-400" },
} as const;

const BUCKET_LABEL: Record<string, Record<string, string>> = {
  zh: {
    operational: "全部成功",
    partial: "响应缓慢",
    degraded: "部分失败",
    major: "多数失败",
    down: "全部失败",
  },
  en: {
    operational: "All Passed",
    partial: "Slow Response",
    degraded: "Partial Failure",
    major: "Mostly Failed",
    down: "All Failed",
  },
};

const CHECK_LABEL: Record<string, Record<string, string>> = {
  zh: { operational: "成功", degraded: "响应慢", down: "失败" },
  en: { operational: "Pass", degraded: "Slow", down: "Fail" },
};

function formatCheckTime(isoString: string): string {
  const d = new Date(isoString);
  const bj = new Date(d.getTime() + 8 * 60 * 60 * 1000);
  const hh = String(bj.getUTCHours()).padStart(2, "0");
  const mm = String(bj.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatBucketTime(bucketKey: string): string {
  return bucketKey.replace(/-/g, "/").replace("T", " ");
}

const BAR_GAP_PX = 1.5;
const BAR_SEGMENTS = 32;
const TOOLTIP_HALF_EST = 85;

function barLayout(barWidth: number) {
  const segW = (barWidth - (BAR_SEGMENTS - 1) * BAR_GAP_PX) / BAR_SEGMENTS;
  const step = segW + BAR_GAP_PX;
  return { segW, step };
}

function segmentIndexFromLocalX(x: number, barWidth: number): number {
  if (barWidth <= 0) return 0;
  const { segW, step } = barLayout(barWidth);
  let idx = Math.round((x - segW / 2) / step);
  if (idx < 0) idx = 0;
  if (idx >= BAR_SEGMENTS) idx = BAR_SEGMENTS - 1;
  return idx;
}

function segmentCenterX(idx: number, barWidth: number): number {
  const { segW, step } = barLayout(barWidth);
  return idx * step + segW / 2;
}

export function UptimeBar({ buckets, locale }: UptimeBarProps) {
  const [tooltip, setTooltip] = useState<{
    segmentIndex: number;
    bucket: BucketData | null;
    bucketKey: string;
  } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Build 32 bars (8h, each 15 min), Beijing time
  const now = new Date();
  const bjNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const bucketMap = new Map(buckets.map((b) => [b.key, b]));

  const bars: { key: string; bucket: BucketData | null }[] = [];
  for (let i = 31; i >= 0; i--) {
    const bjTime = new Date(bjNow.getTime() - i * 15 * 60 * 1000);
    const m = Math.floor(bjTime.getUTCMinutes() / 15) * 15;
    bjTime.setUTCMinutes(m, 0, 0);
    const key = bjTime.toISOString().slice(0, 16);
    bars.push({ key, bucket: bucketMap.get(key) ?? null });
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = segmentIndexFromLocalX(x, rect.width);
      const bar = bars[idx];
      setTooltip({ segmentIndex: idx, bucket: bar.bucket, bucketKey: bar.key });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buckets],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);
  const bucketLabels = BUCKET_LABEL[locale] ?? BUCKET_LABEL.en;
  const checkLabels = CHECK_LABEL[locale] ?? CHECK_LABEL.en;

  return (
    <div className="relative">
      <div
        ref={barRef}
        className="flex gap-[1.5px] h-[20px] cursor-pointer rounded-[3px] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {bars.map((bar, i) => {
          const color = bar.bucket
            ? BAR_COLORS[bar.bucket.status] ?? "bg-white/[0.06]"
            : "bg-white/[0.06]";
          return (
            <div
              key={i}
              className={`flex-1 h-full rounded-[1.5px] ${color} hover:brightness-125 transition-all`}
              style={{ minWidth: 0 }}
            />
          );
        })}
      </div>

      {/* Tooltip with check nodes */}
      {tooltip && (() => {
        const barWidth = barRef.current?.clientWidth ?? 600;
        const half = Math.min(TOOLTIP_HALF_EST, barWidth / 2 - 6);
        const margin = Math.max(12, half);
        const anchorX = segmentCenterX(tooltip.segmentIndex, barWidth);
        const clampedX = Math.max(margin, Math.min(anchorX, barWidth - margin));
        const arrowShift = anchorX - clampedX;
        const { bucket } = tooltip;
        const noData = !bucket || bucket.status === "nodata";
        const nodataLabel = locale === "zh" ? "暂无数据" : "No Data";

        if (noData) {
          return (
            <div
              className="absolute z-50 pointer-events-none"
              style={{ left: clampedX, top: -8, transform: "translate(-50%, -100%)" }}
            >
              <div className="bg-[#1a1a1a] border border-white/[0.1] rounded-lg px-3.5 py-2.5 shadow-xl">
                <div className="flex items-center gap-2">
                  <MinusCircle className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs text-zinc-400">{nodataLabel}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">{formatBucketTime(tooltip.bucketKey)}</p>
              </div>
              <div className="relative">
                <div
                  className="absolute w-2 h-2 bg-[#1a1a1a] border-b border-r border-white/[0.1] rotate-45 -mt-1"
                  style={{ left: `calc(50% + ${arrowShift}px - 4px)` }}
                />
              </div>
            </div>
          );
        }

        const bucketLabel = bucketLabels[bucket.status] ?? bucket.status;

        // Bucket-level icon
        const bucketIconStyle = bucket.status === "operational" || bucket.status === "partial"
          ? STATUS_STYLES.operational
          : bucket.status === "degraded"
            ? STATUS_STYLES.degraded
            : STATUS_STYLES.down;

        return (
          <div
            className="absolute z-50 pointer-events-none"
            style={{ left: clampedX, top: -8, transform: "translate(-50%, -100%)" }}
          >
            <div className="bg-[#1a1a1a] border border-white/[0.1] rounded-lg px-3.5 py-2.5 shadow-xl min-w-[150px]">
              {/* Bucket status header */}
              <div className="flex items-center gap-2 mb-2">
                <bucketIconStyle.Icon className={`w-3.5 h-3.5 ${bucketIconStyle.color}`} />
                <span className="text-xs font-medium text-zinc-200">{bucketLabel}</span>
              </div>

              {/* 3 check nodes */}
              {bucket.checks.length > 0 ? (
                <div className="space-y-1">
                  {bucket.checks.map((check, ci) => {
                    const s = STATUS_STYLES[check.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.down;
                    return (
                      <div key={ci} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className="text-[10px] text-zinc-400">
                          {formatCheckTime(check.time)}
                        </span>
                        <span className={`text-[10px] ${s.color}`}>
                          {checkLabels[check.status] ?? check.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500">{formatBucketTime(tooltip.bucketKey)}</p>
              )}
            </div>
            <div className="relative">
              <div
                className="absolute w-2 h-2 bg-[#1a1a1a] border-b border-r border-white/[0.1] rotate-45 -mt-1"
                style={{ left: `calc(50% + ${arrowShift}px - 4px)` }}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
