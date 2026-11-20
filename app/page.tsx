"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Camera, Check, ChevronDown, CircleHelp, Drill, Heart,
  MapPin, Menu, Search, ShieldCheck, Sparkles, Star, Truck, UserRound, X
} from "lucide-react";
import { equipment, categories, type Equipment } from "../data/equipment";

const stats = [
  { value: "12k+", label: "items ready to rent" },
  { value: "4.9/5", label: "average renter rating" },
  { value: "48", label: "cities covered" }
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All equipment");
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState<(number | string)[]>([]);
  const [selected, setSelected] = useState<Equipment | null>(null);

  const filtered = useMemo(() => equipment.filter((item) => {
    const matchesCategory = activeCategory === "All equipment" || item.category === activeCategory;
    const matchesQuery = `${item.name} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }), [activeCategory, query]);

  const toggleSaved = (id: number | string) => setSaved((current) => current.includes(id)
    ? current.filter((savedId) => savedId !== id) : [...current, id]);

  return (
    <main>
      <nav className="nav-shell">
        <a className="brand" href="#"><span className="brand-mark"><Drill size={18} /></span>equiply</a>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/equipment">All equipment</Link><a href="#how-it-works">How it works</a><a href="#owners">List your gear</a>
          <a href="#help">Help center</a>
        </div>
        <div className="nav-actions"><Link className="sign-in" href="/login"><UserRound size={17} /> Sign in</Link><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button><Link className="button button-dark" href="/register">Get started <ArrowRight size={16} /></Link></div>
      </nav>

      <motion.section className="hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> The smarter way to rent</div>
          <h1>Make room for <em>more</em> possibilities.</h1>
          <p>Get the gear you need, exactly when you need it. Rent from real people, at a fair price, without the commitment.</p>
          <div className="hero-search">
            <div className="search-field"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" /></div>
            <button className="button button-primary" onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}>Find equipment <ArrowRight size={17} /></button>
          </div>
          <div className="trust-row"><div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div><span>Trusted by 8,000+ renters</span><span className="trust-star"><Star size={14} fill="currentColor" /> 4.9 average</span></div>
        </div>
        <div className="hero-art">
          <div className="sun-shape" /><div className="hero-image"><img src="https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1000&q=85" alt="Friends carrying camping gear outdoors" /></div>
          <div className="floating-card location-card"><span className="icon-box peach"><MapPin size={17} /></span><div><strong>4,200+</strong><small>items near you</small></div></div>
          <div className="floating-card rating-card"><Star size={16} fill="#f3a83b" color="#f3a83b" /><strong>4.9</strong><small>community rating</small></div>
        </div>
      </motion.section>

      <section className="stats"><div className="stats-inner">{stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}<div className="stat-note"><BadgeCheck size={18} /><span>Every rental is<br /><strong>verified & protected</strong></span></div></div></section>

      <section className="section" id="explore">
        <div className="section-heading"><div><div className="eyebrow">Explore the collection</div><h2>Find your next <em>favorite</em> thing.</h2></div><a className="text-link" href="#all">View all equipment <ArrowRight size={17} /></a></div>
        <div className="category-row">{categories.map((category) => <button className={`category-pill ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
        <div className="equipment-grid">{filtered.slice(0, 6).map((item) => <EquipmentCard item={item} saved={saved.includes(item.id)} onSave={() => toggleSaved(item.id)} onOpen={() => setSelected(item)} key={item.id} />)}</div>
        {filtered.length === 0 && <div className="empty-state">No equipment matches that search. Try another category or keyword.</div>}
      </section>

      <section className="how-section" id="how-it-works"><div className="section-heading centered"><div><div className="eyebrow">Simple by design</div><h2>Good gear. <em>Good people.</em><br />No guesswork.</h2></div></div><div className="steps"><div className="step"><span>01</span><Search /><h3>Find what you need</h3><p>Search thousands of unique items from people in your community.</p></div><div className="step"><span>02</span><ShieldCheck /><h3>Book with confidence</h3><p>Every owner is verified and every booking is protected.</p></div><div className="step"><span>03</span><Truck /><h3>Enjoy the moment</h3><p>Pick up locally or get it delivered. It&apos;s that easy.</p></div></div></section>

      <section className="section reviews-section"><div className="section-heading"><div><div className="eyebrow">Community stories</div><h2>People rent. <em>People return.</em></h2></div></div><div className="review-grid">{[
        ["Maya Rahman","The camera was spotless and ready on arrival. The whole booking felt safe and simple.","5"],
        ["Arif Hossain","A fair price, a helpful owner, and no warehouse hassle. Perfect for a short project.","5"],
        ["Nabila Islam","I found event equipment the same afternoon. Great support and an easy pickup.","4.9"],
        ["Tanvir Ahmed","The delivery and rental terms were clear. I will definitely rent from Equiply again.","5"]
      ].map(([name,review,rating]) => <article className="review-card" key={name}><div className="review-stars">{Array.from({ length: 5 }).map((_,i)=><Star key={i} size={14} fill="currentColor" />)} <strong>{rating}</strong></div><p>“{review}”</p><div className="review-author"><span>{name[0]}</span><strong>{name}<small>Verified renter</small></strong></div></article>)}</div></section>

      <section className="extra-section"><div><div className="eyebrow">Recently added</div><h2>Fresh gear, ready to work.</h2><p>Discover the newest approved listings from trusted owners.</p><Link className="text-link" href="/equipment">Browse new arrivals <ArrowRight size={16} /></Link></div><div className="extra-section"><div className="extra-mini-card"><Camera /><strong>Photography</strong><span>New kits every week</span></div><div className="extra-mini-card"><Drill /><strong>Tools</strong><span>Project-ready inventory</span></div><div className="extra-mini-card"><Truck /><strong>Vehicles</strong><span>Flexible pickup options</span></div></div></section>

      <section className="owner-banner" id="owners"><div><div className="eyebrow light">Your stuff can do more</div><h2>Turn your idle gear into<br /><em>extra income.</em></h2><p>List the things you&apos;re not using every day. We&apos;ll help you find trusted renters.</p><button className="button button-light">Start listing your gear <ArrowRight size={17} /></button></div><div className="owner-art"><div className="owner-circle" /><img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=700&q=85" alt="Person holding a camera" /><div className="earnings"><small>Average monthly earnings</small><strong>$482.60</strong><span>↗ 18% this month</span></div></div></section>

      <footer id="help"><div className="footer-top"><a className="brand" href="#"><span className="brand-mark"><Drill size={18} /></span>equiply</a><p>Make room for more possibilities.</p><div className="footer-links"><a href="#explore">Explore</a><a href="#owners">For owners</a><a href="#help">Safety</a><a href="#help">Support</a></div></div><div className="footer-bottom"><span>© 2025 Equiply, Inc.</span><span>Made for people who do more.</span></div></footer>

      {selected && <BookingModal item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function EquipmentCard({ item, saved, onSave, onOpen }: { item: Equipment; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return <article className="equipment-card"><div className="card-image"><img src={item.image} alt={item.name} /><span className="availability">Available now</span><button aria-label={`Save ${item.name}`} className={`save-button ${saved ? "saved" : ""}`} onClick={onSave}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button></div><div className="card-content"><div className="card-meta"><span>{item.category}</span><span><Star size={13} fill="currentColor" /> {item.rating}</span></div><h3>{item.name}</h3><p><MapPin size={14} /> {item.location}</p><div className="card-bottom"><span><strong>${item.price}</strong> / day</span><button className="small-link" onClick={onOpen}>View details <ArrowRight size={14} /></button></div></div></article>;
}

function BookingModal({ item, onClose }: { item: Equipment; onClose: () => void }) {
  const [booked, setBooked] = useState(false);
  return <div className="modal-backdrop" onClick={onClose}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={19} /></button><img src={item.image} alt={item.name} /><div className="modal-body">{booked ? <div className="success-state"><span className="success-icon"><Check /></span><h2>Request sent!</h2><p>The owner will review your rental request and get back to you shortly.</p><button className="button button-dark" onClick={onClose}>Done</button></div> : <><div className="card-meta"><span>{item.category}</span><span><Star size={13} fill="currentColor" /> {item.rating}</span></div><h2>{item.name}</h2><p className="modal-location"><MapPin size={15} /> {item.location}</p><div className="date-grid"><label>Pick-up date<input type="date" /></label><label>Return date<input type="date" /></label></div><div className="price-line"><span><strong>${item.price}</strong> / day</span><span>Protected rental</span></div><button className="button button-primary full-button" onClick={() => setBooked(true)}>Request to book <ArrowRight size={17} /></button><small className="modal-note"><ShieldCheck size={14} /> You won&apos;t be charged until the owner accepts.</small></>}</div></div></div>;
}
