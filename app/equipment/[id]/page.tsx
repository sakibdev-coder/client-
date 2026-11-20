"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CalendarDays, Heart, MapPin, ShieldCheck, Star, Truck } from "lucide-react";
import { equipment } from "../../../data/equipment";
import { useAuth } from "../../../lib/auth";

export default function EquipmentDetailsPage() {
  const params = useParams();
  const { user } = useAuth();
  const item = equipment.find((entry) => entry.id === Number(params.id)) || equipment[0];
  const [favorite, setFavorite] = useState(false);
  const [booking, setBooking] = useState(false);
  return <main><nav className="nav-shell"><Link className="brand" href="/"><span className="brand-mark">E</span>equiply</Link><div className="nav-actions"><Link className="button button-dark" href="/dashboard">Dashboard</Link></div></nav><section className="detail-page"><div className="detail-image"><img src={item.image} alt={item.name} /><button className={`detail-favorite ${favorite ? "active" : ""}`} onClick={() => setFavorite(!favorite)}><Heart fill={favorite ? "currentColor" : "none"} /></button></div><div className="detail-info"><div className="card-meta"><span>{item.category}</span><span><Star size={14} fill="currentColor" /> {item.rating}</span></div><h1>{item.name}</h1><p className="detail-location"><MapPin size={16} /> {item.location}</p><p className="detail-description">Professional-grade {item.name.toLowerCase()} maintained by a verified local owner. Ideal for short-term projects, events, and weekend adventures.</p><div className="detail-specs"><div><span>Rental type</span><strong>Daily</strong></div><div><span>Available quantity</span><strong>3 units</strong></div><div><span>Pickup</span><strong>Local</strong></div></div><div className="owner-strip"><span className="owner-avatar">A</span><div><small>Listed by</small><strong>Verified Equipment Owner</strong></div><ShieldCheck /></div><div className="terms-box"><h3>Rental terms</h3><p>Return the equipment in original condition. Late returns may incur an additional daily charge.</p></div><div className="detail-price"><span><strong>${item.price}</strong> / day</span><button className="button button-primary" onClick={() => user ? setBooking(true) : window.location.href = "/login"}>Book now <ArrowRight size={16} /></button></div></div></section>{booking && <div className="modal-backdrop" onClick={() => setBooking(false)}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setBooking(false)}>×</button><div className="modal-body"><h2>Complete your booking</h2><div className="date-grid"><label>Start date<input type="date" /></label><label>End date<input type="date" /></label></div><label className="modal-field">Quantity<input type="number" min="1" defaultValue="1" /></label><label className="modal-field">Contact number<input type="tel" placeholder="+880..." /></label><label className="modal-field">Delivery address<textarea rows={3} placeholder="Street, area, city" /></label><label className="modal-field">Additional notes<textarea rows={2} placeholder="Optional" /></label><button className="button button-primary full-button" onClick={() => window.location.href = "/payment/checkout"}>Continue to secure payment <ShieldCheck size={16} /></button></div></div></div>}</main>;
}
