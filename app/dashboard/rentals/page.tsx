"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../components/DashboardShell";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { formatDate, formatMoney, statusClass } from "../../../lib/format";

type RentalRow = {
  _id: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  equipmentId?: {
    _id?: string;
    name?: string;
  } | string | null;
};

function equipmentName(row: RentalRow) {
  if (row.equipmentId && typeof row.equipmentId === "object") return row.equipmentId.name || "Equipment";
  return "Equipment";
}

function equipmentId(row: RentalRow) {
  if (row.equipmentId && typeof row.equipmentId === "object") return row.equipmentId._id || "";
  return typeof row.equipmentId === "string" ? row.equipmentId : "";
}

export default function RentalsPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<RentalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch("/customer/rentals", {}, token) as RentalRow[];
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
    <DashboardShell title="My rentals" subtitle="Track every booking, payment, and rental date.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Equipment Name</th>
              <th>Rental Start</th>
              <th>Rental End</th>
              <th>Booking Date</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Booking Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8}>Loading your rentals...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8}>
                  No rentals yet. <Link href="/equipment">Browse equipment</Link> to create your first booking.
                </td>
              </tr>
            )}
            {!loading && rows.map((row) => {
              const id = equipmentId(row);
              const canPay = row.paymentStatus === "Pending";
              return (
                <tr key={row._id}>
                  <td><strong>{equipmentName(row)}</strong></td>
                  <td>{formatDate(row.startDate)}</td>
                  <td>{formatDate(row.endDate)}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>{formatMoney(row.totalAmount)}</td>
                  <td>
                    <span className={`status-pill ${statusClass(row.paymentStatus)}`}>
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${statusClass(row.bookingStatus)}`}>
                      {row.bookingStatus}
                    </span>
                  </td>
                  <td>
                    {id && <Link className="table-action" href={`/equipment/${id}`}>View</Link>}
                    {canPay && (
                      <Link className="table-action" href={`/payment/checkout?bookingId=${row._id}`}>
                        Pay now
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
