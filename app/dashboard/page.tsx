"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, Drill, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../lib/auth";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  useEffect(() => { if (!loading && !user) window.location.href = "/login"; }, [loading, user]);
  if (loading || !user) return <main className="status-page"><div className="status-card"><p>Checking your secure session...</p></div></main>;
  return <main className="dashboard-page"><nav className="nav-shell"><Link className="brand" href="/"><span className="brand-mark"><Drill size={18} /></span>equiply</Link><button className="sign-in" onClick={() => { signOut(); window.location.href = "/"; }}><LogOut size={17} /> Sign out</button></nav><section className="dashboard-content"><div className="dashboard-welcome"><div className="eyebrow"><span className="eyebrow-dot" /> {user.role} account</div><h1>Good to see you, <em>{user.name.split(" ")[0]}.</em></h1><p>Your secure Equiply dashboard is ready. Manage your profile and rental activity from here.</p></div><div className="dashboard-grid"><div className="dashboard-card"><span className="dashboard-icon"><ShieldCheck /></span><h2>Your account is protected</h2><p>You are signed in with a secure JWT session. Your role determines which marketplace tools you can access.</p><span className="role-badge">{user.role}</span></div><div className="dashboard-card"><h2>Quick actions</h2><Link className="dashboard-action" href="/#explore">Explore equipment <ArrowLeft size={16} /></Link>{(user.role === "Owner" || user.role === "Admin") && <button className="dashboard-action">Manage listings <ArrowLeft size={16} /></button>}<button className="dashboard-action" onClick={() => { signOut(); window.location.href = "/"; }}>Sign out securely <LogOut size={16} /></button></div></div></section></main>;
}
