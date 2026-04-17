"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, CreditCard, Settings, LogOut, Menu, X, Key, Landmark, Ticket, Boxes, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { MeshBackground } from "@/components/MeshBackground";
import { useIdleTimer } from "@/hooks/useIdleTimer";

const navItemDefs = [
  { href: "/dashboard", labelKey: "overview" as const, icon: LayoutDashboard },
  { href: "/dashboard/keys", labelKey: "apiKeys" as const, icon: Key },
  { href: "/dashboard/models", labelKey: "models" as const, icon: Boxes },
  { href: "/dashboard/vault", labelKey: "vault" as const, icon: Landmark },
  { href: "/dashboard/redeem", labelKey: "redeemCode" as const, icon: Ticket },
  { href: "/dashboard/referral", labelKey: "referral" as const, icon: Users },
  { href: "/dashboard/billing", labelKey: "billing" as const, icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navItemDefs.map((item) => ({ ...item, label: t(item.labelKey) }));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string; plan: string | null; displayName: string } | null>(null);
  useIdleTimer();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const email = data.user.email || "";
      const dn = data.user.user_metadata?.display_name || "";
      setUserInfo({ email, plan: null, displayName: dn });
      fetch("/api/billing/subscription")
        .then((r) => r.json())
        .then((res) => {
          if (res.plan) setUserInfo((prev) => prev ? { ...prev, plan: res.plan } : null);
        })
        .catch(() => {});
    });

    // Listen for user metadata updates (e.g. display_name changed in Settings)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_UPDATED" && session?.user) {
        const dn = session.user.user_metadata?.display_name || "";
        setUserInfo((prev) => prev ? { ...prev, displayName: dn } : null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const displayName = userInfo?.displayName || userInfo?.email?.split("@")[0] || "...";
  const initial = displayName.charAt(0).toUpperCase();
  const planLabel = userInfo?.plan
    ? userInfo.plan.charAt(0).toUpperCase() + userInfo.plan.slice(1) + " " + t("plan")
    : null;

  return (
    <div className="h-screen bg-[#09090b] flex overflow-hidden">
      <MeshBackground />
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#0c0c10] overflow-y-auto">
        <div className="p-6 border-b border-white/[0.04]">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-base font-semibold text-zinc-100">Hapuppy</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-violet-500/[0.08] text-violet-400 border border-violet-500/15"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-violet-400">{initial}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-zinc-300 truncate">{displayName}</p>
              {planLabel && (
                <p className="text-[10px] text-zinc-600">{planLabel}</p>
              )}
            </div>
            <Link
              href="/dashboard/settings"
              className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors"
              title={t("settings")}
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
              title={t("signOut")}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#09090b]/95 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={24} />
            <span className="text-base font-semibold text-zinc-100">Hapuppy</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-zinc-400 hover:text-zinc-100 cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/[0.04] bg-[#0c0c10] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-violet-500/[0.08] text-violet-400"
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === "/dashboard/settings"
                  ? "bg-violet-500/[0.08] text-violet-400"
                  : "text-zinc-500 hover:text-zinc-200"
              )}
            >
              <Settings className="w-4 h-4" />
              {t("settings")}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {t("signOut")}
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="w-full px-6 py-8 md:py-10 mt-14 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
