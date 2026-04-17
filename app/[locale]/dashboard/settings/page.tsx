"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Settings, UserCircle, Key, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Edit states
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email || "");
        setDisplayName(data.user.user_metadata?.display_name || "");
      }
    });
  }, []);

  function openNameDialog() {
    setNameInput(displayName);
    setNameDialogOpen(true);
  }

  async function handleSaveName() {
    if (!nameInput.trim()) return;
    setSavingName(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { display_name: nameInput.trim() },
      });
      if (error) throw error;
      setDisplayName(nameInput.trim());
      setNameDialogOpen(false);
      toast.success(t("usernameUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedUpdate"));
    } finally {
      setSavingName(false);
    }
  }

  function openPasswordDialog() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordDialogOpen(true);
  }

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      toast.error(t("passwordMinError"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("newPasswordMismatch"));
      return;
    }

    setSavingPassword(true);
    try {
      const supabase = createClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        toast.error(t("incorrectPassword"));
        setSavingPassword(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      setPasswordDialogOpen(false);
      toast.success(t("passwordUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("failedUpdatePassword"));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
          <Settings className="w-5 h-5 text-zinc-400" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-zinc-100">{t("title")}</h1>
          <p className="text-xs text-zinc-600">{t("subtitle")}</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-violet-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-100">{t("profile")}</h2>
        </div>

        <div className="space-y-px rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
          {/* Username */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <UserCircle className="w-4 h-4 text-zinc-600" />
              <div>
                <p className="text-sm font-medium text-zinc-200">{t("username")}</p>
                <p className="text-xs text-zinc-600">{displayName || t("notSet")}</p>
              </div>
            </div>
            <button
              onClick={openNameDialog}
              className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              {t("edit")}
            </button>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-100">{t("security")}</h2>
        </div>

        <div className="space-y-px rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
          {/* Password */}
          <div className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-zinc-600" />
              <div>
                <p className="text-sm font-medium text-zinc-200">{t("password")}</p>
                <p className="text-xs text-zinc-600">{t("changePassword")}</p>
              </div>
            </div>
            <button
              onClick={openPasswordDialog}
              className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              {t("edit")}
            </button>
          </div>
        </div>
      </div>

      {/* Username Dialog */}
      <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editUsername")}</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={t("enterUsername")}
              maxLength={30}
              autoFocus
              className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setNameDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {tc("cancel")}
            </button>
            <button
              onClick={handleSaveName}
              disabled={savingName || !nameInput.trim()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 transition-colors cursor-pointer disabled:opacity-40"
            >
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : tc("save")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("changePasswordTitle")}</DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("currentPassword")}</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("enterCurrentPassword")}
                autoFocus
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("newPassword")}</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("minChars")}
                minLength={8}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">{t("confirmNewPassword")}</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("reenterPassword")}
                minLength={8}
                className="h-10 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 focus:ring-0"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[10px] text-red-400">{t("passwordMismatch")}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setPasswordDialogOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
            >
              {tc("cancel")}
            </button>
            <button
              onClick={handleChangePassword}
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 transition-colors cursor-pointer disabled:opacity-40"
            >
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : t("updatePassword")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
