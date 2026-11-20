"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Image, Lock, Mail, UserRound } from "lucide-react";
import { AuthError, AuthShell } from "../../components/AuthShell";
import { GoogleButton } from "../../components/GoogleButton";
import { useAuth } from "../../lib/auth";
import { authRequest } from "../../lib/api";

export default function RegisterPage() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setBusy(true);
    try { const result = await authRequest("/auth/register", form); signIn(result.token!, result.user!); window.location.href = "/dashboard"; }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to create your account."); } finally { setBusy(false); }
  };
  return <AuthShell title="Make room for more." subtitle="Create an account and start renting better equipment today."><GoogleButton onError={setError} /><div className="auth-divider"><span>or create with email</span></div>{error && <AuthError message={error} />}<form className="auth-form" onSubmit={submit}><label>Full name<div className="input-with-icon"><UserRound size={17} /><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div></label><label>Email address<div className="input-with-icon"><Mail size={17} /><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div></label><label>Profile photo URL <span className="optional">(optional)</span><div className="input-with-icon"><Image size={17} /><input type="url" value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} placeholder="https://..." /></div></label><label>Password<div className="input-with-icon"><Lock size={17} /><input type={showPassword ? "text" : "password"} minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><button className="button button-dark auth-submit" disabled={busy}>{busy ? "Creating account..." : <>Create account <ArrowRight size={16} /></>}</button></form><p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p></AuthShell>;
}
