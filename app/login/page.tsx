"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AuthError, AuthShell } from "../../components/AuthShell";
import { GoogleButton } from "../../components/GoogleButton";
import { useAuth } from "../../lib/auth";
import { authRequest } from "../../lib/api";

export default function LoginPage() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setBusy(true);
    try { const result = await authRequest("/auth/login", form); signIn(result.token!, result.user!); window.location.href = "/dashboard"; }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); } finally { setBusy(false); }
  };
  return <AuthShell title="Welcome back." subtitle="Sign in to manage your rentals and discover new gear."><GoogleButton onError={setError} /><div className="auth-divider"><span>or continue with email</span></div>{error && <AuthError message={error} />}<form className="auth-form" onSubmit={submit}><label>Email address<div className="input-with-icon"><Mail size={17} /><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label><label>Password<div className="input-with-icon"><Lock size={17} /><input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><button className="button button-dark auth-submit" disabled={busy}>{busy ? "Signing in..." : <>Sign in <ArrowRight size={16} /></>}</button></form><p className="auth-switch">New to Equiply? <Link href="/register">Create an account</Link></p></AuthShell>;
}
