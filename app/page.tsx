"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Camera, Drill, MapPin, Search,
  ShieldCheck, Sparkles, Star, Truck, Wallet
} from "lucide-react";
import { popularCategories, whyChooseUs } from "../data/equipment";
import { API_URL } from "../lib/config";
import { useAuth } from "../lib/auth";
import { rentalUnitLabel } from "../lib/rental";
import type { EquipmentItem } from "../lib/types";

const stats = [
  { value: "12k+", label: "items ready to rent" },
  { value: "4.9/5", label: "average renter rating" },
  { value: "48", label: "cities covered" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<EquipmentItem[]>([]);
  const [recent, setRecent] = useState<EquipmentItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingFeatured(true);
      try {
        const [featuredRes, recentRes] = await Promise.all([
          fetch(`${API_URL}/equipment/featured`),
          fetch(`${API_URL}/equipment?sort=recent`)
        ]);
        const featuredData = featuredRes.ok ? await featuredRes.json() : [];
        const recentData = recentRes.ok ? await recentRes.json() : { items: [] };
        if (cancelled) return;
        setFeatured(Array.isArray(featuredData) ? featuredData.slice(0, 6) : []);
        setRecent(Array.isArray(recentData.items) ? recentData.items.slice(0, 3) : []);
      } catch {
        if (!cancelled) {
          setFeatured([]);
          setRecent([]);
        }
      } finally {
        if (!cancelled) setLoadingFeatured(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, []);

  const searchHref = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    const qs = params.toString();
    return qs ? `/equipment?${qs}` : "/equipment";
  }, [query]);

  const openDetails = (id: string) => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/equipment/${id}`)}`);
      return;
    }
    router.push(`/equipment/${id}`);
  };

  return (
    <main>
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
      >
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Professional equipment, on demand</div>
          <h1>Rent with <em>confidence.</em><br />Create without limits.</h1>
          <p>A curated marketplace for verified gear — search locally, book your dates, and checkout securely in minutes.</p>
          <div className="hero-search">
            <div className="search-field">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cameras, tools, events..."
                onKeyDown={(event) => {
                  if (event.key === "Enter") router.push(searchHref);
                }}
              />
            </div>
            <Link className="button button-primary" href={searchHref}>
              Find equipment <ArrowRight size={17} />
            </Link>
          </div>
          <div className="trust-row">
            <div className="avatar-stack"><span>J</span><span>M</span><span>A</span><span>+</span></div>
            <span>Trusted by 8,000+ renters</span>
            <span className="trust-star"><Star size={14} fill="currentColor" /> 4.9 average</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="sun-shape" aria-hidden="true" />
          <div className="hero-image">
            <img
              src="/images/hero-gear.jpg"
              alt="Campers carrying outdoor rental gear"
              width={1000}
              height={650}
            />
          </div>
          <div className="floating-card location-card">
            <span className="icon-box peach"><MapPin size={17} /></span>
            <div><strong>4,200+</strong><small>items near you</small></div>
          </div>
          <div className="floating-card rating-card">
            <Star size={16} fill="#f3a83b" color="#f3a83b" />
            <strong>4.9</strong>
            <small>community rating</small>
          </div>
        </div>
      </motion.section>

      <section className="stats">
        <div className="stats-inner">
          {stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
          <div className="stat-note">
            <BadgeCheck size={18} />
            <span>Every rental is<br /><strong>verified & protected</strong></span>
          </div>
        </div>
      </section>

      <motion.section
        className="section"
        id="explore"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">Curated for you</div>
            <h2>Featured gear worth <em>renting.</em></h2>
          </div>
          <Link className="text-link" href="/equipment">View all equipment <ArrowRight size={17} /></Link>
        </div>

        <div className="equipment-grid">
          {loadingFeatured && Array.from({ length: 3 }).map((_, index) => (
            <div className="equipment-card skeleton-card" key={`skeleton-${index}`} />
          ))}
          {!loadingFeatured && featured.map((item) => (
            <motion.article className="equipment-card" key={item._id} variants={fadeUp} transition={{ duration: 0.45 }}>
              <div className="card-image">
                <img src={item.image} alt={item.name} />
                <span className="availability">{item.quantity > 0 ? "Available now" : "Unavailable"}</span>
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span>{item.category}</span>
                  <span><Star size={13} fill="currentColor" /> {item.rating || 5}</span>
                </div>
                <h3>{item.name}</h3>
                <p><MapPin size={14} /> {item.location}</p>
                <div className="card-bottom">
                  <span><strong>${item.price}</strong> / {rentalUnitLabel(item.rentalType)}</span>
                  <button className="small-link" type="button" onClick={() => openDetails(item._id)}>
                    View details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        {!loadingFeatured && featured.length === 0 && (
          <div className="empty-state">No approved featured equipment yet. Check back soon.</div>
        )}
      </motion.section>

      <motion.section
        className="section categories-section"
        id="categories"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">Categories</div>
            <h2>Explore by <em>discipline.</em></h2>
          </div>
        </div>
        <div className="category-grid">
          {popularCategories.map((category) => (
            <motion.div key={category.name} variants={fadeUp} transition={{ duration: 0.4 }}>
              <Link className="category-card" href={`/equipment?category=${encodeURIComponent(category.name)}`}>
                <img src={category.image} alt={category.name} />
                <div>
                  <strong>{category.name}</strong>
                  <span>{category.blurb}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="section why-section" id="why-us">
        <div className="section-heading">
          <div>
            <div className="eyebrow">Why Equiply</div>
            <h2>Designed for serious <em>creators.</em></h2>
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

      <section className="how-section" id="how-it-works">
        <div className="section-heading centered">
          <div>
            <div className="eyebrow">How it works</div>
            <h2>Three steps. <em>Zero friction.</em></h2>
          </div>
        </div>
        <div className="steps">
          <div className="step"><span>01</span><Search /><h3>Find what you need</h3><p>Search thousands of unique items from people in your community.</p></div>
          <div className="step"><span>02</span><ShieldCheck /><h3>Book with confidence</h3><p>Every owner is verified and every booking is protected.</p></div>
          <div className="step"><span>03</span><Truck /><h3>Pay and enjoy</h3><p>Complete Stripe Checkout, then pick up locally or arrange delivery.</p></div>
        </div>
      </section>

      <motion.section
        className="section reviews-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">Trusted by renters</div>
            <h2>Reviews from the <em>field.</em></h2>
          </div>
        </div>
        <div className="review-grid">
          {[
            ["Maya Rahman", "The camera was spotless and ready on arrival. The whole booking felt safe and simple.", "5"],
            ["Arif Hossain", "A fair price, a helpful owner, and no warehouse hassle. Perfect for a short project.", "5"],
            ["Nabila Islam", "I found event equipment the same afternoon. Great support and an easy pickup.", "4.9"],
            ["Tanvir Ahmed", "The delivery and rental terms were clear. I will definitely rent from Equiply again.", "5"]
          ].map(([name, review, rating]) => (
            <motion.article className="review-card" key={name} variants={fadeUp}>
              <div className="review-stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <strong>{rating}</strong>
              </div>
              <p>“{review}”</p>
              <div className="review-author">
                <span>{name[0]}</span>
                <strong>{name}<small>Verified renter</small></strong>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <section className="extra-section" id="recent">
        <div>
          <div className="eyebrow">New arrivals</div>
          <h2>Just listed. Ready to rent.</h2>
          <p>Fresh inventory from verified owners — approved and available now.</p>
          <Link className="text-link" href="/equipment">Browse new arrivals <ArrowRight size={16} /></Link>
        </div>
        <div className="recent-mini-grid">
          {recent.length > 0 ? recent.map((item) => (
            <button className="extra-mini-card recent-card" type="button" key={item._id} onClick={() => openDetails(item._id)}>
              <img src={item.image} alt="" />
              <strong>{item.name}</strong>
              <span>{item.location}</span>
            </button>
          )) : (
            <>
              <div className="extra-mini-card"><Camera /><strong>Photography</strong><span>New kits every week</span></div>
              <div className="extra-mini-card"><Drill /><strong>Tools</strong><span>Project-ready inventory</span></div>
              <div className="extra-mini-card"><Truck /><strong>Vehicles</strong><span>Flexible pickup options</span></div>
            </>
          )}
        </div>
      </section>

      <section className="owner-banner" id="owners">
        <div>
          <div className="eyebrow light">For owners</div>
          <h2>Idle gear becomes<br /><em>steady income.</em></h2>
          <p>List once, manage bookings, and watch earnings grow from a clean owner dashboard.</p>
          <Link className="button button-light" href="/register">Start listing your gear <ArrowRight size={17} /></Link>
        </div>
        <div className="owner-art">
          <div className="owner-circle" />
          <img src="/images/owner-camera.jpg" alt="Person holding a camera" width={700} height={900} />
          <div className="earnings">
            <small>Average monthly earnings</small>
            <strong>$482.60</strong>
            <span>↗ 18% this month</span>
          </div>
        </div>
      </section>
    </main>
  );
}
