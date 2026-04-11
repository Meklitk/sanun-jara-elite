import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "@/api/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Crown, ArrowLeft, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(username.trim(), password);
      toast.success("Signed in");
      nav("/admin");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-landscape.jpg')" }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-amber-950/60 backdrop-blur-[2px]" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,205,86,0.08)_0%,_transparent_50%)]" />
      
      {/* Gold Border Lines */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient-bg" />
      <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient-bg" />

      {/* Back to Website Link - Fixed Left */}
      <Link 
        to="/" 
        className="fixed left-6 top-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-2 text-sm text-gold/70 hover:text-gold transition-all duration-300 group hidden lg:flex"
      >
        <div className="flex items-center gap-2 -rotate-90 origin-center whitespace-nowrap">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-90" />
          <span className="uppercase tracking-[0.2em] text-xs font-medium">Back to website</span>
        </div>
      </Link>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <Card className="glass-panel w-full p-8 border-gold/20 shadow-[0_25px_60px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gold-gradient-bg flex items-center justify-center shadow-lg shadow-gold/20">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-gold" />
              <h1 className="text-2xl font-bold gold-gradient-text">Sanun Jara</h1>
            </div>
            <p className="text-sm text-gold/70 uppercase tracking-[0.2em] font-medium">Admin Portal</p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gold/90 text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="glass-panel border-gold/20 bg-black/20 text-foreground placeholder:text-muted-foreground/50 focus:border-gold/50 focus:ring-gold/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gold/90 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold/10">
           
          </div>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gold/40">
          Sanun Jara Elite Admin Dashboard
        </p>
      </div>
    </div>
  );
}

