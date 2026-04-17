"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Zap, Gauge } from "lucide-react";

interface UsageStatsProps {
  requests: number;
  totalTokens: number;
  rpm: number;
}

export function UsageStats({ requests, totalTokens, rpm }: UsageStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={<Activity className="w-4 h-4" />}
        label="Today's Requests"
        value={requests.toLocaleString()}
        accent="violet"
      />
      <StatCard
        icon={<Zap className="w-4 h-4" />}
        label="Total Tokens"
        value={formatTokens(totalTokens)}
        accent="cyan"
      />
      <StatCard
        icon={<Gauge className="w-4 h-4" />}
        label="RPM Limit"
        value={rpm.toString()}
        accent="emerald"
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "violet" | "cyan" | "emerald";
}) {
  const accentStyles = {
    violet: "text-violet-400 bg-violet-500/[0.08] border-violet-500/15",
    cyan: "text-cyan-400 bg-cyan-500/[0.08] border-cyan-500/15",
    emerald: "text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/15",
  };

  const textColor = {
    violet: "text-violet-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
  };

  return (
    <Card className="group transition-all duration-300 hover:border-zinc-700/60">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${accentStyles[accent]}`}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <p className={`text-3xl font-bold ${textColor[accent]}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}
