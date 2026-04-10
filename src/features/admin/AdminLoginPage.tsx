import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/api/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="glass-panel w-full max-w-md p-6 gold-border-glow">
        <h1 className="text-2xl font-bold gold-gradient-text">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage site content.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button disabled={loading} className="w-full gold-gradient-bg text-secondary-foreground font-semibold">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-xs text-muted-foreground">
            Default (dev) admin is configured in `server/.env`.
          </div>
        </form>
      </Card>
    </div>
  );
}

