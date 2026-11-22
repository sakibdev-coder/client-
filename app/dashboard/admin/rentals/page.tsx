"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { formatDate, formatMoney, statusClass } from "../../../../lib/format";

type AdminRental = {
  _id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  customerId?: { name?: string; email?: string } | string | null;
  ownerId?: { name?: string; email?: string } | string | null;
  equipmentId?: { name?: string } | string | null;
};

function person(value?: { name?: string; email?: string } | string | null, fallback = "—") {
  if (value && typeof value === "object") {
    return {
      name: value.name || fallback,
      email: value.email || ""
    };
  }
  return { name: fallback, email: "" };
}

function equipmentName(row: AdminRental) {
  if (row.equipmentId && typeof row.equipmentId === "object") return row.equipmentId.name || "Equipment";
  return "Equipment";
}

export default function AdminRentalsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<AdminRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch("/admin/rentals", {}, token) as AdminRental[];
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) {
          setRows([]);
          toast.error(error instanceof Error ? error.message : "Unable to load rentals.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <DashboardShell title="All rentals" subtitle="Monitor every customer, owner, payment, and booking.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer Information</th>
              <th>Owner Information</th>
              <th>Equipment Name</th>
              <th>Rental Duration</th>
              <th>Booking Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7}>Loading rentals...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={7}>No rental bookings yet.</td></tr>}
            {!loading && rows.map((row) => {
              const customer = person(row.customerId, "Customer");
              const owner = person(row.ownerId, "Owner");
              return (
                <tr key={row._id}>
                  <td>
                    <strong>{customer.name}</strong>
                    {customer.email ? <><br />{customer.email}</> : null}
                  </td>
                  <td>
                    <strong>{owner.name}</strong>
                    {owner.email ? <><br />{owner.email}</> : null}
                  </td>
                  <td>{equipmentName(row)}</td>
                  <td>{formatDate(row.startDate)} – {formatDate(row.endDate)}</td>
                  <td>{formatMoney(row.totalAmount)}</td>
                  <td><span className={`status-pill ${statusClass(row.paymentStatus)}`}>{row.paymentStatus}</span></td>
                  <td><span className={`status-pill ${statusClass(row.bookingStatus)}`}>{row.bookingStatus}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
