"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthError, AuthShell } from "../../components/AuthShell";
import { GoogleButton } from "../../components/GoogleButton";
import { useAuth } from "../../lib/auth";
import { authRequest } from "../../lib/api";
import { dashboardHome } from "../../lib/roles";

function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await authRequest("/auth/login", form);
      signIn(result.token!, result.user!);
      toast.success("Welcome back! Signed in successfully.");
      const next = searchParams.get("next");
      router.push(next || dashboardHome(result.user!.role));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back." subtitle="Sign in to manage your rentals and discover new gear.">
      <GoogleButton onError={(message) => { setError(message); toast.error(message); }} />
      <div className="auth-divider"><span>or continue with email</span></div>
      {error && <AuthError message={error} />}
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email address
          <div className="input-with-icon">
            <Mail size={17} />
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
        </label>
        <label>
          Password
          <div className="input-with-icon">
            <Lock size={17} />
            <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
            <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </label>
        <button className="button button-dark auth-submit" disabled={busy}>
          {busy ? "Signing in..." : <>Sign in <ArrowRight size={16} /></>}
        </button>
      </form>
      <p className="auth-switch">New to Equiply? <Link href="/register">Create an account</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="status-page"><div className="status-card"><p>Loading sign in...</p></div></main>}>
      <LoginForm />
    </Suspense>
  );
}
