"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";
import { Drill, LayoutDashboard, Heart, CalendarCheck, UserRound, Plus, Package, ListChecks, Users, Settings } from "lucide-react";

export default function DashboardShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  useEffect(() => { if (!loading && !user) window.location.href = "/login"; }, [loading, user]);
  if (loading || !user) return <main className="status-page"><div className="status-card"><p>Loading your dashboard...</p></div></main>;
  const customer = [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/rentals", label: "My rentals", icon: CalendarCheck }, { href: "/dashboard/favorites", label: "Favorites", icon: Heart }, { href: "/dashboard/profile", label: "Profile", icon: UserRound }];
  const owner = [{ href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/owner/add", label: "Add equipment", icon: Plus }, { href: "/dashboard/owner/equipment", label: "My equipment", icon: Package }, { href: "/dashboard/owner/rentals", label: "My equipment rentals", icon: ListChecks }, { href: "/dashboard/profile", label: "My profile", icon: UserRound }];
  const admin = [{ href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard }, { href: "/dashboard/admin/users", label: "All users", icon: Users }, { href: "/dashboard/admin/equipment", label: "All equipment", icon: Package }, { href: "/dashboard/admin/rentals", label: "All rentals", icon: ListChecks }, { href: "/dashboard/profile", label: "My profile", icon: Settings }];
  const links = user.role === "Admin" ? admin : user.role === "Owner" ? owner : customer;
  return <main className="dashboard-shell"><aside className="dashboard-sidebar"><Link className="brand" href="/"><span className="brand-mark"><Drill size={17} /></span>equiply</Link><nav>{links.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={17} />{label}</Link>)}</nav><div className="sidebar-user"><span>{user.name[0]}</span><div><strong>{user.name}</strong><small>{user.role}</small></div></div></aside><section className="dashboard-main"><header><div><div className="eyebrow">{user.role} dashboard</div><h1>{title}</h1><p>{subtitle}</p></div><Link className="button button-light" href="/">View marketplace</Link></header>{children}</section></main>;
}
