"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import {
  Search, Key, Copy, Check, ChevronDown,
  MessageSquare, ImageIcon, AudioLines, Mic, ShieldCheck, Puzzle,
  Layers, Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PROVIDER_ICONS } from "@/components/icons/providers";
import type { LucideIcon } from "lucide-react";

interface ModelItem {
  id: string;
  provider: string;
  providerName: string;
  type: string;
  typeName: string;
  inputWeight: number | null;
  outputWeight: number | null;
}

interface FilterOption {
  key: string;
  name: string;
  count: number;
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  chat: MessageSquare,
  image: ImageIcon,
  embedding: Layers,
  speech: AudioLines,
  transcription: Mic,
  moderation: ShieldCheck,
  other: Puzzle,
};

const TYPE_COLORS: Record<string, string> = {
  chat: "text-blue-400 bg-blue-500/10",
  image: "text-violet-400 bg-violet-500/10",
  embedding: "text-amber-400 bg-amber-500/10",
  speech: "text-emerald-400 bg-emerald-500/10",
  transcription: "text-cyan-400 bg-cyan-500/10",
  moderation: "text-orange-400 bg-orange-500/10",
  other: "text-zinc-400 bg-zinc-500/10",
};

const TYPE_ICON_COLORS: Record<string, string> = {
  chat: "text-blue-400",
  image: "text-violet-400",
  embedding: "text-amber-400",
  speech: "text-emerald-400",
  transcription: "text-cyan-400",
  moderation: "text-orange-400",
  other: "text-zinc-400",
};

function formatWeight(v: number | null): string {
  if (v === null || v === undefined) return "—";
  if (v < 0.01) return `${v}x`;
  if (v >= 1 && v === Math.floor(v)) return `${v}x`;
  return `${parseFloat(v.toFixed(2))}x`;
}

/* ── Custom Dropdown ── */
function Dropdown({
  value,
  options,
  allLabel,
  allIcon,
  onChange,
  renderIcon,
}: {
  value: string;
  options: FilterOption[];
  allLabel: string;
  allIcon: LucideIcon;
  onChange: (v: string) => void;
  renderIcon?: (key: string) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.key === value);
  const selectedLabel = value === "ALL" ? allLabel : selectedOption?.name ?? value;
  const AllIcon = allIcon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-zinc-300 hover:border-white/[0.15] hover:bg-white/[0.05] transition-colors cursor-pointer"
      >
        {value === "ALL" ? (
          <AllIcon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
        ) : renderIcon ? (
          renderIcon(value)
        ) : null}
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 z-50 min-w-[100px] w-max rounded-xl border border-white/[0.08] bg-[#141416] shadow-2xl shadow-black/40 p-1.5 max-h-64 overflow-y-auto">
          <button
            onClick={() => { onChange("ALL"); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] transition-colors cursor-pointer rounded-lg ${
              value === "ALL" ? "text-violet-400 bg-violet-500/[0.08]" : "text-zinc-300 hover:bg-white/[0.04]"
            }`}
          >
            <AllIcon className={`w-3.5 h-3.5 flex-shrink-0 ${value === "ALL" ? "text-violet-400" : "text-zinc-500"}`} />
            <span className="flex-1 text-left">{allLabel}</span>
            {value === "ALL" && <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />}
          </button>
          {options.map((o) => {
            const isActive = value === o.key;
            return (
              <button
                key={o.key}
                onClick={() => { onChange(o.key); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-[13px] transition-colors cursor-pointer rounded-lg ${
                  isActive ? "text-violet-400 bg-violet-500/[0.08]" : "text-zinc-300 hover:bg-white/[0.04]"
                }`}
              >
                {renderIcon ? renderIcon(o.key) : null}
                <span className="flex-1 text-left">{o.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ModelsPage() {
  const t = useTranslations("models");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<ModelItem[]>([]);
  const [providers, setProviders] = useState<FilterOption[]>([]);
  const [types, setTypes] = useState<FilterOption[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [provisioned, setProvisioned] = useState(true);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      fetch("/api/models/available")
        .then((r) => r.json())
        .then((data) => {
          setModels(data.models ?? []);
          setProviders(data.providers ?? []);
          setTypes(data.types ?? []);
          setTotalCount(data.count ?? 0);
          setProviderCount(data.providerCount ?? 0);
          setProvisioned(data.provisioned !== false);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, [router]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return models.filter((m) => {
      if (providerFilter !== "ALL" && m.provider !== providerFilter) return false;
      if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
      if (q && !m.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [models, search, providerFilter, typeFilter]);

  const chatCount = useMemo(() => types.find((t) => t.key === "chat")?.count ?? 0, [types]);
  const imageCount = useMemo(() => types.find((t) => t.key === "image")?.count ?? 0, [types]);

  function renderProviderIcon(key: string) {
    const Icon = PROVIDER_ICONS[key];
    if (Icon) return <Icon size={14} className="flex-shrink-0 text-zinc-400" />;
    return <Puzzle className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />;
  }

  function renderTypeIcon(key: string) {
    const Icon = TYPE_ICONS[key] ?? Puzzle;
    const color = TYPE_ICON_COLORS[key] ?? "text-zinc-400";
    return <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />;
  }

  if (!loading && !provisioned) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
          <p className="text-xs text-zinc-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-8 text-center">
          <Key className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400 mb-4">{t("provisionFirst")}</p>
          <Link
            href="/dashboard/keys"
            className="inline-flex h-9 px-4 items-center rounded-lg bg-violet-500/15 text-violet-400 text-sm font-medium border border-violet-500/20 hover:bg-violet-500/25 transition-colors"
          >
            {t("goToKeys")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">{t("title")}</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {loading ? t("subtitle") : t("subtitleCount", { count: totalCount })}
        </p>
      </div>

      {/* Stat Cards */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t("totalModels"), value: totalCount, icon: Puzzle, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: t("chatModels"), value: chatCount, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: t("imageModels"), value: imageCount, icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: t("providers"), value: providerCount, icon: Layers, color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map((card) => (
            <div key={card.label} className="rounded-[14px] border border-white/[0.06] bg-[#111111] px-4 py-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-zinc-100 leading-none tabular-nums">{card.value}</div>
              <div className="text-[10px] text-zinc-600 mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filters */}
      <div className="relative z-20 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/30"
          />
        </div>
        <Dropdown
          value={providerFilter}
          options={providers}
          allLabel={t("allProviders")}
          allIcon={Sparkles}
          onChange={setProviderFilter}
          renderIcon={renderProviderIcon}
        />
        <Dropdown
          value={typeFilter}
          options={types}
          allLabel={t("allTypes")}
          allIcon={Layers}
          onChange={setTypeFilter}
          renderIcon={renderTypeIcon}
        />
      </div>

      {/* Filter count */}
      {!loading && (search || providerFilter !== "ALL" || typeFilter !== "ALL") && (
        <p className="text-xs text-zinc-600">
          {t("showing", { filtered: filtered.length, total: totalCount })}
        </p>
      )}

      {/* Model List */}
      {loading ? (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] divide-y divide-white/[0.04]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-5 w-14" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] p-8 text-center">
          <p className="text-sm text-zinc-500">{t("noResults")}</p>
        </div>
      ) : (
        <div className="rounded-[14px] border border-white/[0.06] bg-[#111111] divide-y divide-white/[0.04]">
          {filtered.map((model) => {
            const TypeIcon = TYPE_ICONS[model.type] ?? Puzzle;
            const colorClass = TYPE_COLORS[model.type] ?? TYPE_COLORS.other;
            const [iconColor, iconBg] = colorClass.split(" ");
            return (
              <div
                key={model.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors group/row"
              >
                {/* Model name + pricing */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono text-zinc-200 truncate">{model.id}</span>
                    <button
                      onClick={() => handleCopy(model.id)}
                      className="opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
                    >
                      {copiedId === model.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-zinc-600 hover:text-zinc-300" />
                      )}
                    </button>
                  </div>
                  {(model.inputWeight !== null || model.outputWeight !== null) && (
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <span className="text-[11px] text-zinc-600">
                        inp: <span className="text-zinc-500">{formatWeight(model.inputWeight)}</span>
                      </span>
                      <span className="text-[11px] text-zinc-600">
                        out: <span className="text-zinc-500">{formatWeight(model.outputWeight)}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Type badge */}
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${iconBg}`}>
                  <TypeIcon className={`w-3 h-3 ${iconColor}`} />
                  <span className={iconColor}>{model.typeName}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
