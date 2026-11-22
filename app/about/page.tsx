"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { whyChooseUs } from "../../data/equipment";

const values = [
  {
    title: "Transparent marketplace",
    text: "Equiply connects equipment owners and customers with clear pricing, verified listings, and secure checkout."
  },
  {
    title: "Built for real projects",
    text: "From photography kits to construction tools, rent what you need for the exact days your work requires."
  },
  {
    title: "Trust first",
    text: "Listings go through admin approval, payments run through Stripe, and roles keep every dashboard safe."
  }
];

export default function AboutPage() {
  return (
    <main className="content-page">
      <motion.section
        className="content-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="eyebrow"><span className="eyebrow-dot" /> About us</div>
        <h1>A rental marketplace made for people who <em>get things done.</em></h1>
        <p>
          Equiply helps customers find verified equipment fast, helps owners earn from idle gear,
          and gives admins full control over approvals, users, and rentals.
        </p>
        <div className="content-hero-actions">
          <Link className="button button-dark" href="/equipment">Browse equipment <ArrowRight size={16} /></Link>
          <Link className="button button-light" href="/register">Join Equiply</Link>
        </div>
      </motion.section>

      <section className="section why-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Our story</div>
            <h2>Why Equiply <em>exists.</em></h2>
          </div>
        </div>
        <div className="content-story-grid">
          {values.map((item) => (
            <article className="why-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section why-section" id="why-us">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Why choose us</div>
            <h2>Built for confident <em>rentals.</em></h2>
          </div>
        </div>
        <div className="why-grid">
          {whyChooseUs.map((item, index) => {
            const Icon = [Wallet, BadgeCheck, Sparkles, ShieldCheck][index] || ShieldCheck;
            return (
              <article className="why-card" key={item.title}>
                <span className="why-icon"><Icon size={20} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
