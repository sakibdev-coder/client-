"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Drill, LayoutDashboard, Heart, CalendarCheck, UserRound, Plus, Package,
  ListChecks, Users, Settings, LogOut
} from "lucide-react";
import { useAuth } from "../lib/auth";

export default function DashboardShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
  }, [loading, pathname, user]);

  if (loading || !user) {
    return <main className="status-page"><div className="status-card"><p>Loading your dashboard...</p></div></main>;
  }

  const customer = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/rentals", label: "My rentals", icon: CalendarCheck },
    { href: "/dashboard/favorites", label: "Favorites", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound }
  ];
  const owner = [
    { href: "/dashboard/owner", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/owner/add", label: "Add equipment", icon: Plus },
    { href: "/dashboard/owner/equipment", label: "My equipment", icon: Package },
    { href: "/dashboard/owner/rentals", label: "My equipment rentals", icon: ListChecks },
    { href: "/dashboard/profile", label: "My profile", icon: UserRound }
  ];
  const admin = [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "All users", icon: Users },
    { href: "/dashboard/admin/equipment", label: "All equipment", icon: Package },
    { href: "/dashboard/admin/rentals", label: "All rentals", icon: ListChecks },
    { href: "/dashboard/profile", label: "My profile", icon: Settings }
  ];
  const links = user.role === "Admin" ? admin : user.role === "Owner" ? owner : customer;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark"><Drill size={17} /></span>
          equiply
        </Link>
        <nav>
          {links.map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              <Icon size={17} />{label}
            </Link>
          ))}
          <button className="sidebar-logout" type="button" onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        </nav>
        <div className="sidebar-user-block">
          <Link className="sidebar-user" href="/dashboard/profile">
            <span>{user.photo ? <img src={user.photo} alt="" /> : user.name[0]}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </Link>
          <button className="sidebar-logout-bottom" type="button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header>
          <div>
            <div className="eyebrow">{user.role} dashboard</div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="dashboard-header-actions">
            <Link className="dashboard-profile" href="/dashboard/profile">
              <span>{user.photo ? <img src={user.photo} alt="" /> : user.name[0]}</span>
              <div>
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </div>
            </Link>
            <button className="button button-light dashboard-logout-btn" type="button" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
