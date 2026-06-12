import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "@/api/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown, ArrowLeft, Shield } from "lucide-react";
import AdminLanguageToggle from "./AdminLanguageToggle";
import { formatAdmin, useAdminT } from "./admin-i18n";

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-landscape.jpg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-amber-950/60 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,205,86,0.08)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient-bg" />
      <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient-bg" />

      <Link
        to="/"
        className="fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-black/40 px-3 py-2 text-xs text-gold/80 backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-gold lg:left-6 lg:top-1/2 lg:-translate-y-1/2 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0"
      >
        <span className="inline-flex items-center gap-2 lg:-rotate-90 lg:origin-center lg:whitespace-nowrap">
          <ArrowLeft className="h-4 w-4 lg:rotate-90" />
          <span className="uppercase tracking-[0.18em] font-medium">{at.backToSite}</span>
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="glass-panel w-full p-8 border-gold/20 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">
          <div className="mb-6">
            <AdminLanguageToggle />
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold/20">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-gold" />
              <h1 className="text-2xl font-bold gold-gradient-text">Sanun Jara</h1>
            </div>
            <p className="text-sm text-gold/70 uppercase tracking-[0.2em] font-medium">{at.adminPortal}</p>
            <p className="mt-2 text-xs text-muted-foreground">{at.loginSubtitle}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gold/90 text-sm font-medium">
                {at.username}
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="admin"
                className="glass-panel border-gold/20 bg-black/20 text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gold/90 text-sm font-medium">
                {at.password}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="glass-panel border-gold/20 bg-black/20 text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
              />
            </div>
            <Button
              disabled={loading}
              className="w-full gold-gradient-bg text-black font-bold py-3 shadow-lg shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {at.signingIn}
                </span>
              ) : (
                at.signIn
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground">{at.loginDockerHint}</p>
        </Card>

        <p className="mt-8 text-center text-xs text-gold/40">{at.loginFooter}</p>
      </div>
    </div>
  );
}
