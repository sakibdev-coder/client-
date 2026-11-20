"use client";

import Link from "next/link";
import { Drill, ShieldCheck } from "lucide-react";

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return <main className="auth-page"><div className="auth-brand"><Link className="brand" href="/"><span className="brand-mark"><Drill size={18} /></span>equiply</Link><span><ShieldCheck size={15} /> Safe, simple rentals</span></div><section className="auth-card"><div className="auth-heading"><div className="eyebrow"><span className="eyebrow-dot" /> Welcome to Equiply</div><h1>{title}</h1><p>{subtitle}</p></div>{children}</section></main>;
}

export function AuthError({ message }: { message: string }) {
  return <div className="auth-error" role="alert">{message}</div>;
}
