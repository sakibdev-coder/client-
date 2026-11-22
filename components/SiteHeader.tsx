"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Drill, LogOut, Menu, UserRound, X } from "lucide-react";
import { useAuth } from "../lib/auth";
import { dashboardHome } from "../lib/roles";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const logout = async () => {
    await signOut();
    setMenuOpen(false);
    toast.success("Logged out successfully.");
    router.push("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
    <nav className="nav-shell">
      <Link className="brand" href="/" onClick={closeMenu}>
        <span className="brand-mark"><Drill size={18} /></span>
        equiply
      </Link>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link href="/" className={pathname === "/" ? "active-nav" : ""} onClick={closeMenu}>Home</Link>
        <Link href="/equipment" className={pathname.startsWith("/equipment") ? "active-nav" : ""} onClick={closeMenu}>All Equipment</Link>
        <Link href="/about" className={pathname.startsWith("/about") ? "active-nav" : ""} onClick={closeMenu}>About us</Link>
        <Link href="/how-it-works" className={pathname.startsWith("/how-it-works") ? "active-nav" : ""} onClick={closeMenu}>How it works</Link>
        <Link href="/contact" className={pathname.startsWith("/contact") ? "active-nav" : ""} onClick={closeMenu}>Contact</Link>

        <div className="mobile-auth-links">
          {!loading && user ? (
            <>
              <Link href={dashboardHome(user.role)} onClick={closeMenu}>Dashboard</Link>
              <Link href="/dashboard/profile" onClick={closeMenu}>Profile</Link>
              <button type="button" className="mobile-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu}>Login</Link>
              <Link href="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      </div>

      <div className="nav-actions">
        {!loading && user ? (
          <>
            <Link className="sign-in desktop-only" href={dashboardHome(user.role)}>
              <UserRound size={17} /> {user.name.split(" ")[0]}
            </Link>
            <button className="sign-in desktop-only" type="button" onClick={logout}>
              <LogOut size={17} /> Logout
            </button>
            <Link className="button button-dark desktop-only" href={dashboardHome(user.role)}>
              Dashboard <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <Link className="sign-in desktop-only" href="/login"><UserRound size={17} /> Login</Link>
            <Link className="button button-dark desktop-only" href="/register">Get started <ArrowRight size={16} /></Link>
          </>
        )}
        <button className="menu-button" type="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && <button className="nav-backdrop" type="button" aria-label="Close menu" onClick={closeMenu} />}
    </nav>
    </header>
  );
}
