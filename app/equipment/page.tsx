"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { equipment, categories } from "../../data/equipment";

export default function AllEquipmentPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All equipment");
  const [rentalType, setRentalType] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("recent");
  const [items, setItems] = useState(equipment);
  const [total, setTotal] = useState(equipment.length);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All equipment") params.set("category", category);
      if (rentalType !== "All") params.set("rentalType", rentalType);
      if (availability !== "All") params.set("availability", availability);
      if (sort === "low") params.set("sort", "priceAsc");
      if (sort === "high") params.set("sort", "priceDesc");
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/equipment?${params}`);
        if (!response.ok) throw new Error("Equipment could not be loaded.");
        const data = await response.json();
        if (Array.isArray(data)) { setItems(equipment); setTotal(equipment.length); }
        else if (Array.isArray(data.items)) {
          const mapped = data.items.map((item: { _id: string; name: string; category: string; location: string; price: number; rentalType: string; rating?: number; image: string }) => ({ id: item._id, name: item.name, category: item.category, location: item.location, price: item.price, rating: item.rating || 5, image: item.image }));
          setItems(mapped); setTotal(data.total);
        }
      } catch { setItems(equipment); setTotal(equipment.length); }
      finally { setLoading(false); }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search, category, rentalType, availability, sort]);
  return <main className="catalog-page"><nav className="nav-shell"><Link className="brand" href="/"><span className="brand-mark">E</span>equiply</Link><div className="nav-actions"><Link className="sign-in" href="/login">Sign in</Link><Link className="button button-dark" href="/register">Get started</Link></div></nav><section className="catalog-content"><div className="catalog-heading"><div><div className="eyebrow">Explore equipment</div><h1>Find exactly what<br /><em>gets the job done.</em></h1></div><span>{loading ? "Loading..." : `${total} items available`}</span></div><div className="catalog-toolbar"><div className="catalog-search"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or category" /></div><select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={rentalType} onChange={(e) => setRentalType(e.target.value)}><option>All</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select><select value={availability} onChange={(e) => setAvailability(e.target.value)}><option>All</option><option>Available</option><option>Unavailable</option></select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently added</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div><div className="equipment-grid catalog-grid">{items.map((item) => <article className="equipment-card" key={item.id}><div className="card-image"><img src={item.image} alt={item.name} /><span className="availability">Available</span></div><div className="card-content"><div className="card-meta"><span>{item.category}</span><span><Star size={13} fill="currentColor" /> {item.rating}</span></div><h3>{item.name}</h3><p><MapPin size={14} /> {item.location}</p><div className="card-bottom"><span><strong>${item.price}</strong> / day</span><Link className="small-link" href={`/equipment/${item.id}`}>View details <ArrowRight size={14} /></Link></div></div></article>)}</div></section></main>;
}
