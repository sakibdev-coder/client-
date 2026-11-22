import Link from "next/link";
import { Drill } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="help">
      <div className="footer-top">
        <Link className="brand" href="/">
          <span className="brand-mark"><Drill size={18} /></span>
          equiply
        </Link>
        <p>Professional equipment rentals — verified gear, secure checkout, confident bookings.</p>
        <div className="footer-links">
          <Link href="/equipment">Explore</Link>
          <Link href="/about">About us</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/contact">Contact</Link>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">X</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Equiply, Inc.</span>
        <span>Built for creators & professionals.</span>
      </div>
    </footer>
  );
}
