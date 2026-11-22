"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { formatDate, formatMoney, statusClass } from "../../../../lib/format";

type OwnerRental = {
  _id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  customerId?: { name?: string; email?: string; phone?: string } | string | null;
  equipmentId?: { name?: string } | string | null;
};

function customerInfo(row: OwnerRental) {
  if (row.customerId && typeof row.customerId === "object") {
    return {
      name: row.customerId.name || "Customer",
      email: row.customerId.email || "—",
      phone: row.customerId.phone || ""
    };
  }
  return { name: "Customer", email: "—", phone: "" };
}

function equipmentName(row: OwnerRental) {
  if (row.equipmentId && typeof row.equipmentId === "object") return row.equipmentId.name || "Equipment";
  return "Equipment";
}

export default function OwnerRentalsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<OwnerRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch("/owner/rentals", {}, token) as OwnerRental[];
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
    <DashboardShell title="My equipment rentals" subtitle="Review rentals for your listed equipment.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer Information</th>
              <th>Equipment Information</th>
              <th>Rental Duration</th>
              <th>Required Quantity</th>
              <th>Booking Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={7}>Loading rentals...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7}>No rentals on your equipment yet.</td></tr>
            )}
            {!loading && rows.map((row) => {
              const customer = customerInfo(row);
              return (
                <tr key={row._id}>
                  <td>
                    <strong>{customer.name}</strong><br />
                    {customer.email}
                    {customer.phone ? <><br />{customer.phone}</> : null}
                  </td>
                  <td>{equipmentName(row)}</td>
                  <td>{formatDate(row.startDate)} – {formatDate(row.endDate)}</td>
                  <td>{row.quantity}</td>
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
