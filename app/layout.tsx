import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/auth";

export const metadata: Metadata = {
  title: "Equiply | Rent better equipment",
  description: "A trusted marketplace for professional equipment rentals."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
