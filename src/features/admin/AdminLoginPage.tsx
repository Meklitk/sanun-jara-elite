import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { loginAdmin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminLanguageToggle from "./AdminLanguageToggle";
import { useAdminT } from "./admin-i18n";

const inputClass =
  "h-11 rounded-xl border-[#D4A017]/20 bg-black/35 text-foreground placeholder:text-foreground/35 focus-visible:border-[#D4A017]/45 focus-visible:ring-[#D4A017]/20";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const at = useAdminT();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      toast.error(at.loginMissingFields);
      return;
    }
    setLoading(true);
    try {
      await loginAdmin(username.trim(), password);
      toast.success(at.loginSuccess);
      nav("/admin");
    } catch {
      toast.error(at.loginFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/images/hero-landscape.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.92)_0%,rgba(20,12,4,0.88)_45%,rgba(0,0,0,0.94)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(212,160,23,0.12),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(212,160,23,0.08),transparent_38%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #D4A017 25%, transparent 25%, transparent 75%, #D4A017 75%), linear-gradient(45deg, #D4A017 25%, transparent 25%, transparent 75%, #D4A017 75%)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A017]/70 to-transparent" aria-hidden />

      <Link
        to="/"
        className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-[#D4A017]/25 bg-black/45 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#D4A017]/85 backdrop-blur-md transition-all duration-300 hover:border-[#D4A017]/50 hover:bg-black/60 hover:text-[#D4A017] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {at.backToSite}
      </Link>

      <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <AdminLanguageToggle />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 py-20 sm:px-8 lg:flex-row lg:items-stretch lg:gap-0 lg:px-12">
        <section className="flex flex-col justify-center pb-10 text-center lg:w-[46%] lg:pb-0 lg:pr-12 lg:text-left">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D4A017]/30 bg-black/40 p-3 shadow-[0_0_40px_rgba(212,160,23,0.15)] lg:mx-0">
            <img
              src="/images/emblem-sanunjara.png"
              alt="Sanun Jara"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="mt-6 text-[11px] uppercase tracking-[0.38em] text-[#D4A017]/75">Sanun Jara</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            {at.adminPortal}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-foreground/58 lg:max-w-none">
            {at.loginSubtitle}
          </p>
          <p className="mt-6 hidden text-[10px] uppercase tracking-[0.28em] text-[#D4A017]/45 lg:block">
            Confiance · Noblesse · Persévérance
          </p>
        </section>

        <div className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-[#D4A017]/25 to-transparent lg:block" aria-hidden />

        <section className="w-full max-w-md lg:flex lg:w-[54%] lg:max-w-none lg:items-center lg:pl-12">
          <div className="w-full rounded-[1.75rem] border border-[#D4A017]/22 bg-black/50 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.55),0_0_48px_rgba(212,160,23,0.06)] backdrop-blur-xl sm:p-9">
            <div className="mb-7 flex items-center gap-3 border-b border-[#D4A017]/12 pb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4A017]/25 bg-[#D4A017]/10">
                <Lock className="h-4 w-4 text-[#D4A017]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{at.signIn}</p>
                <p className="text-xs text-foreground/50">{at.loginSecureHint}</p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4A017]/80">
                  {at.username}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4A017]/80">
                  {at.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-xl border border-[#D4A017]/50 bg-[linear-gradient(135deg,#D4A017,#B8860B)] text-xs font-bold uppercase tracking-[0.2em] text-black shadow-[0_12px_32px_rgba(212,160,23,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {at.signingIn}
                  </span>
                ) : (
                  at.signIn
                )}
              </Button>
            </form>
          </div>
        </section>
      </div>

      <p className="absolute bottom-5 left-0 right-0 z-10 text-center text-[10px] uppercase tracking-[0.22em] text-foreground/30">
        © {new Date().getFullYear()} Sanun Jara
      </p>
    </div>
  );
}
