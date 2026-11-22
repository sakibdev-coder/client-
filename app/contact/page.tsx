"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Name, email, and message are required.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      toast.success("Message sent. Our support team will get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setBusy(false);
    }, 500);
  };

  return (
    <main className="content-page">
      <motion.section
        className="content-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="eyebrow"><span className="eyebrow-dot" /> Contact</div>
        <h1>We are here when you need <em>support.</em></h1>
        <p>
          Questions about bookings, listings, payments, or your account?
          Reach the Equiply team and we will help you move forward.
        </p>
      </motion.section>

      <section className="section content-contact">
        <div className="contact-grid">
          <div className="contact-info">
            <article className="why-card">
              <span className="why-icon"><Mail size={20} /></span>
              <h3>Email</h3>
              <p>support@equiply.app</p>
            </article>
            <article className="why-card">
              <span className="why-icon"><Phone size={20} /></span>
              <h3>Phone</h3>
              <p>+880 1700-000000</p>
            </article>
            <article className="why-card">
              <span className="why-icon"><MapPin size={20} /></span>
              <h3>Office</h3>
              <p>Dhanmondi, Dhaka, Bangladesh</p>
            </article>
            <Link className="button button-dark" href="/equipment">
              Browse equipment <ArrowRight size={16} />
            </Link>
          </div>

          <form className="profile-form contact-form" onSubmit={submit}>
            <div className="profile-grid">
              <label>
                Full name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label className="wide">
                Subject
                <input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Booking help, listing question..."
                />
              </label>
              <label className="wide">
                Message
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help"
                />
              </label>
            </div>
            <button className="button button-primary" type="submit" disabled={busy}>
              {busy ? "Sending..." : <>Send message <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
