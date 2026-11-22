"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

function hideChrome(pathname: string) {
  return pathname.startsWith("/dashboard")
    || pathname.startsWith("/login")
    || pathname.startsWith("/register")
    || pathname.startsWith("/payment")
    || pathname.startsWith("/auth");
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (hideChrome(pathname)) return <>{children}</>;
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
