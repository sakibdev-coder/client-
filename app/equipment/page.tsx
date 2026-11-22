"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MapPin, Search, Star } from "lucide-react";
import { categories } from "../../data/equipment";
import { API_URL } from "../../lib/config";
import { useAuth } from "../../lib/auth";
import { rentalUnitLabel } from "../../lib/rental";

type CatalogItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  quantity: number;
  rating: number;
  image: string;
};

function AllEquipmentInner() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All equipment");
  const [rentalType, setRentalType] = useState(searchParams.get("rentalType") || "All");
  const [availability, setAvailability] = useState(searchParams.get("availability") || "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "recent");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All equipment") params.set("category", category);
      if (rentalType !== "All") params.set("rentalType", rentalType);
      if (availability !== "All") params.set("availability", availability);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort === "low") params.set("sort", "priceAsc");
      else if (sort === "high") params.set("sort", "priceDesc");
      else params.set("sort", "recent");

      const nextQuery = params.toString();
      router.replace(nextQuery ? `/equipment?${nextQuery}` : "/equipment", { scroll: false });

      try {
        const response = await fetch(`${API_URL}/equipment?${params}`);
        if (!response.ok) throw new Error("Equipment could not be loaded.");
        const data = await response.json();
        if (Array.isArray(data?.items)) {
          const mapped = data.items.map((item: {
            _id: string;
            name: string;
            category: string;
            location: string;
            price: number;
            rentalType?: string;
            quantity?: number;
            rating?: number;
            image: string;
          }) => ({
            id: item._id,
            name: item.name,
            category: item.category,
            location: item.location,
            price: item.price,
            rentalType: item.rentalType || "Daily",
            quantity: item.quantity ?? 0,
            rating: item.rating || 5,
            image: item.image
          }));
          setItems(mapped);
          setTotal(data.total ?? mapped.length);
        } else {
          setItems([]);
          setTotal(0);
        }
      } catch {
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [availability, category, maxPrice, minPrice, rentalType, router, search, sort]);

  const openDetails = (id: string) => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/equipment/${id}`)}`);
      return;
    }
    router.push(`/equipment/${id}`);
  };

  return (
    <main className="catalog-page">
      <section className="catalog-content">
        <div className="catalog-heading">
          <div>
            <div className="eyebrow">Explore equipment</div>
            <h1>Find exactly what<br /><em>gets the job done.</em></h1>
          </div>
          <span>{loading ? "Loading..." : `${total} items available`}</span>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={rentalType} onChange={(e) => setRentalType(e.target.value)}>
            <option>All</option>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option>All</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Recently added</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>

        <div className="price-filter-row">
          <label>
            Min price
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Max price
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="500"
            />
          </label>
          {(minPrice || maxPrice) && (
            <button
              className="button button-light"
              type="button"
              onClick={() => {
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              Clear price
            </button>
          )}
        </div>

        <div className="equipment-grid catalog-grid">
          {items.map((item) => (
            <article className="equipment-card" key={item.id}>
              <div className="card-image">
                <img src={item.image} alt={item.name} />
                <span className="availability">{item.quantity > 0 ? "Available" : "Unavailable"}</span>
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span>{item.category}</span>
                  <span><Star size={13} fill="currentColor" /> {item.rating}</span>
                </div>
                <h3>{item.name}</h3>
                <p><MapPin size={14} /> {item.location}</p>
                <div className="card-bottom">
                  <span>
                    <strong>${item.price}</strong> / {rentalUnitLabel(item.rentalType)}
                    <small style={{ display: "block", marginTop: 2 }}>{item.rentalType}</small>
                  </span>
                  <button className="small-link" type="button" onClick={() => openDetails(item.id)}>
                    View details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && items.length === 0 && (
          <div className="empty-state">No approved equipment matched your search or filters.</div>
        )}
      </section>
    </main>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<main className="status-page"><div className="status-card"><p>Loading equipment...</p></div></main>}>
      <AllEquipmentInner />
    </Suspense>
  );
}
