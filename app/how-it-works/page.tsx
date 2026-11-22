"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck, Truck, UserRound, Package, BadgeCheck } from "lucide-react";

const renterSteps = [
  {
    step: "01",
    icon: Search,
    title: "Find what you need",
    text: "Search by name or location, then filter by category, rental type, price, and availability."
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Book with confidence",
    text: "Open a private details page, save favorites, and submit booking dates with delivery details."
  },
  {
    step: "03",
    icon: Truck,
    title: "Pay and enjoy",
    text: "Complete Stripe Checkout securely. Your booking becomes confirmed and appears in My Rentals."
  }
];

const ownerSteps = [
  {
    icon: Package,
    title: "List your gear",
    text: "Owners add equipment with images, pricing, and terms. New listings start as Pending."
  },
  {
    icon: BadgeCheck,
    title: "Get approved",
    text: "Admins review and approve listings so only trusted equipment appears publicly."
  },
  {
    icon: UserRound,
    title: "Earn from rentals",
    text: "Track bookings, payments, and earnings from the owner dashboard analytics."
  }
];

export default function HowItWorksPage() {
  return (
    <main className="content-page">
      <motion.section
        className="content-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="eyebrow"><span className="eyebrow-dot" /> How it works</div>
        <h1>Good gear. Good people. <em>No guesswork.</em></h1>
        <p>
          Whether you are renting for a project or listing unused equipment,
          Equiply keeps the flow simple from browse to booking to payment.
        </p>
        <div className="content-hero-actions">
          <Link className="button button-primary" href="/equipment">Start browsing <ArrowRight size={16} /></Link>
          <Link className="button button-light" href="/register">Create an account</Link>
        </div>
      </motion.section>

      <section className="how-section content-how">
        <div className="section-heading centered">
          <div>
            <div className="eyebrow">For customers</div>
            <h2>Rent in three clear steps.</h2>
          </div>
        </div>
        <div className="steps">
          {renterSteps.map(({ step, icon: Icon, title, text }) => (
            <div className="step" key={step}>
              <span>{step}</span>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section why-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">For owners</div>
            <h2>Turn idle gear into <em>income.</em></h2>
          </div>
        </div>
        <div className="why-grid">
          {ownerSteps.map(({ icon: Icon, title, text }) => (
            <article className="why-card" key={title}>
              <span className="why-icon"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
