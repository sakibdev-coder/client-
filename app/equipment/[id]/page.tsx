"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { estimateRentalTotal, rentalUnitLabel } from "../../../lib/rental";
import type { BookingRecord, EquipmentItem } from "../../../lib/types";

type BookingForm = {
  startDate: string;
  endDate: string;
  quantity: number;
  contactNumber: string;
  deliveryAddress: string;
  notes: string;
};

function ownerName(item: EquipmentItem) {
  if (item.ownerId && typeof item.ownerId === "object") return item.ownerId.name || "Verified owner";
  return "Verified owner";
}

function ownerPhoto(item: EquipmentItem) {
  if (item.ownerId && typeof item.ownerId === "object") return item.ownerId.photo || "";
  return "";
}

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const equipmentId = String(params.id || "");

  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingBusy, setBookingBusy] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    startDate: "",
    endDate: "",
    quantity: 1,
    contactNumber: "",
    deliveryAddress: "",
    notes: ""
  });

  const estimatedTotal = useMemo(() => {
    if (!item) return 0;
    return estimateRentalTotal(item.price, item.rentalType, form.startDate, form.endDate, form.quantity);
  }, [form.endDate, form.quantity, form.startDate, item]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch(`/equipment/${equipmentId}`) as EquipmentItem;
        if (cancelled) return;
        setItem(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Equipment not found.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (equipmentId) void load();
    return () => { cancelled = true; };
  }, [equipmentId]);

  useEffect(() => {
    if (!token || user?.role !== "Customer" || !equipmentId) return;
    let cancelled = false;
    apiFetch("/favorites", {}, token)
      .then((favorites) => {
        if (cancelled || !Array.isArray(favorites)) return;
        const matched = favorites.some((entry: { equipmentId?: { _id?: string } | string }) => {
          const id = typeof entry.equipmentId === "object" ? entry.equipmentId?._id : entry.equipmentId;
          return String(id) === equipmentId;
        });
        setFavorite(matched);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [equipmentId, token, user?.role]);

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      contactNumber: current.contactNumber || user.phone || "",
      deliveryAddress: current.deliveryAddress || user.address || ""
    }));
  }, [user]);

  const toggleFavorite = async () => {
    if (!token || user?.role !== "Customer") {
      toast.error("Only customers can save favorites.");
      return;
    }
    setFavoriteBusy(true);
    try {
      if (favorite) {
        await apiFetch(`/favorites/${equipmentId}`, { method: "DELETE" }, token);
        setFavorite(false);
        toast.success("Removed from favorites.");
      } else {
        await apiFetch(`/favorites/${equipmentId}`, { method: "POST" }, token);
        setFavorite(true);
        toast.success("Added to favorites.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to update favorites.");
    } finally {
      setFavoriteBusy(false);
    }
  };

  const openBooking = () => {
    if (authLoading) return;
    if (!user || !token) {
      router.push(`/login?next=${encodeURIComponent(`/equipment/${equipmentId}`)}`);
      return;
    }
    if (user.role !== "Customer") {
      toast.error("Only customers can book equipment.");
      return;
    }
    setBookingOpen(true);
  };

  const submitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !item) return;

    if (!form.startDate || !form.endDate) {
      toast.error("Select rental start and end dates.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date must be after the start date.");
      return;
    }
    if (form.quantity < 1 || form.quantity > item.quantity) {
      toast.error(`Quantity must be between 1 and ${item.quantity}.`);
      return;
    }
    if (!form.contactNumber.trim() || !form.deliveryAddress.trim()) {
      toast.error("Contact number and delivery address are required.");
      return;
    }

    setBookingBusy(true);
    try {
      const booking = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          equipmentId: item._id,
          startDate: form.startDate,
          endDate: form.endDate,
          quantity: form.quantity,
          contactNumber: form.contactNumber.trim(),
          deliveryAddress: form.deliveryAddress.trim(),
          notes: form.notes.trim()
        })
      }, token) as BookingRecord;

      toast.success(`Booking created. Total $${booking.totalAmount.toFixed(2)}`);
      router.push(`/payment/checkout?bookingId=${booking._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create booking.");
    } finally {
      setBookingBusy(false);
    }
  };

  if (loading || authLoading) {
    return <main className="status-page"><div className="status-card"><p>Loading equipment details...</p></div></main>;
  }

  if (error || !item) {
    return (
      <main className="status-page">
        <div className="status-card">
          <span className="status-code">Not found</span>
          <h1>Equipment unavailable</h1>
          <p>{error || "This listing could not be found."}</p>
          <Link className="button button-dark" href="/equipment">Back to all equipment</Link>
        </div>
      </main>
    );
  }

  const photo = ownerPhoto(item);
  const available = item.quantity > 0 && item.status === "Approved";

  return (
    <main>
      <section className="detail-page">
        <div className="detail-image">
          <img src={item.image} alt={item.name} />
          <button
            className={`detail-favorite ${favorite ? "active" : ""}`}
            disabled={favoriteBusy}
            onClick={toggleFavorite}
            aria-label={favorite ? "Remove favorite" : "Add favorite"}
          >
            <Heart fill={favorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="detail-info">
          <div className="card-meta">
            <span>{item.category}</span>
            <span><Star size={14} fill="currentColor" /> {item.rating || 5}</span>
          </div>
          <h1>{item.name}</h1>
          <p className="detail-location"><MapPin size={16} /> {item.location}</p>
          <p className="detail-description">{item.description || "Professional equipment maintained by a verified local owner."}</p>

          <div className="detail-specs">
            <div><span>Rental type</span><strong>{item.rentalType}</strong></div>
            <div><span>Available quantity</span><strong>{item.quantity} units</strong></div>
            <div><span>Condition</span><strong>{item.condition || "Good"}</strong></div>
          </div>

          {(item.brand || item.model) && (
            <div className="detail-specs">
              <div><span>Brand</span><strong>{item.brand || "—"}</strong></div>
              <div><span>Model</span><strong>{item.model || "—"}</strong></div>
              <div><span>Status</span><strong>{available ? "Available" : "Unavailable"}</strong></div>
            </div>
          )}

          <div className="owner-strip">
            <span className="owner-avatar">
              {photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : ownerName(item)[0]}
            </span>
            <div>
              <small>Listed by</small>
              <strong>{ownerName(item)}</strong>
            </div>
            <ShieldCheck />
          </div>

          <div className="terms-box">
            <h3>Rental terms</h3>
            <p>{item.terms || "Return the equipment in original condition. Late returns may incur an additional rental charge."}</p>
          </div>

          <div className="detail-price">
            <span>
              <strong>${item.price}</strong> / {rentalUnitLabel(item.rentalType)}
            </span>
            <button className="button button-primary" disabled={!available} onClick={openBooking}>
              {available ? <>Book now <ArrowRight size={16} /></> : "Unavailable"}
            </button>
          </div>
        </div>
      </section>

      {bookingOpen && (
        <div className="modal-backdrop" onClick={() => !bookingBusy && setBookingOpen(false)}>
          <div className="booking-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" disabled={bookingBusy} onClick={() => setBookingOpen(false)}>×</button>
            <img src={item.image} alt={item.name} />
            <form className="modal-body" onSubmit={submitBooking}>
              <div className="card-meta">
                <span>{item.category}</span>
                <span><Star size={13} fill="currentColor" /> {item.rating || 5}</span>
              </div>
              <h2>Complete your booking</h2>
              <p className="modal-location"><MapPin size={15} /> {item.location}</p>
              <p style={{ color: "#6d766f", fontSize: 13 }}>Signed in as {user?.name}</p>

              <div className="date-grid">
                <label>
                  Start date
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                  />
                </label>
                <label>
                  End date
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                  />
                </label>
              </div>

              <label className="modal-field">
                Required quantity
                <input
                  type="number"
                  min={1}
                  max={item.quantity}
                  required
                  value={form.quantity}
                  onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}
                />
              </label>
              <label className="modal-field">
                Contact number
                <input
                  type="tel"
                  required
                  value={form.contactNumber}
                  onChange={(event) => setForm({ ...form, contactNumber: event.target.value })}
                  placeholder="+880..."
                />
              </label>
              <label className="modal-field">
                Delivery address
                <textarea
                  rows={3}
                  required
                  value={form.deliveryAddress}
                  onChange={(event) => setForm({ ...form, deliveryAddress: event.target.value })}
                  placeholder="Street, area, city"
                />
              </label>
              <label className="modal-field">
                Additional notes
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder="Optional"
                />
              </label>

              <div className="price-line">
                <span>Estimated total</span>
                <strong>${estimatedTotal.toFixed(2)}</strong>
              </div>

              <button className="button button-primary full-button" type="submit" disabled={bookingBusy}>
                {bookingBusy ? "Creating booking..." : <>Continue to secure payment <ShieldCheck size={16} /></>}
              </button>
              <small className="modal-note"><ShieldCheck size={14} /> Stripe Checkout opens next. No charge until payment succeeds.</small>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
