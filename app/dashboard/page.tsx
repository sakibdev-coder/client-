"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, CalendarCheck, Heart, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../../lib/auth";
import DashboardShell from "../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../components/DashboardCharts";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  useEffect(() => { if (!loading && !user) window.location.href = "/login"; }, [loading, user]);
  if (loading || !user) return <main className="status-page"><div className="status-card"><p>Checking your secure session...</p></div></main>;
  return <DashboardShell title={`Welcome, ${user.name.split(" ")[0]}`} subtitle="Here is what is happening with your rentals."><div className="metric-grid customer-metrics"><div><span><CalendarCheck size={15} /> Active rentals</span><strong>2</strong><small>1 starting soon</small></div><div><span><Heart size={15} /> Favorites</span><strong>6</strong><small>Ready to revisit</small></div><div><span><ShieldCheck size={15} /> Account</span><strong>{user.role}</strong><small>Verified profile</small></div></div><div className="dashboard-chart-grid"><ActivityChart /><RevenueChart /></div><div className="dashboard-grid"><div className="dashboard-card"><span className="dashboard-icon"><ShieldCheck /></span><h2>Your account is protected</h2><p>Your session stays secure when you reload private pages. Your role controls which tools you can access.</p><span className="role-badge">{user.role}</span></div><div className="dashboard-card"><h2>Quick actions</h2><Link className="dashboard-action" href="/equipment">Explore equipment <ArrowLeft size={16} /></Link><Link className="dashboard-action" href="/dashboard/rentals">View my rentals <ArrowLeft size={16} /></Link><button className="dashboard-action" onClick={() => { signOut(); window.location.href = "/"; }}>Sign out securely <LogOut size={16} /></button></div></div></DashboardShell>;
}
