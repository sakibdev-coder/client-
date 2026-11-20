"use client";
import DashboardShell from "../../../components/DashboardShell";

export default function RentalsPage() {
  const rows = [
    { equipment: "Sony A7 IV Camera", start: "Nov 22, 2026", end: "Nov 24, 2026", booked: "Nov 20, 2026", amount: "$84", payment: "Paid", status: "Confirmed" },
    { equipment: "Cedar Camp Set", start: "Dec 04, 2026", end: "Dec 07, 2026", booked: "Nov 18, 2026", amount: "$84", payment: "Pending", status: "Pending" }
  ];
  return <DashboardShell title="My rentals" subtitle="Track every booking, payment, and rental date."><div className="table-wrap"><table><thead><tr><th>Equipment</th><th>Start</th><th>End</th><th>Booked</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.equipment}><td><strong>{row.equipment}</strong></td><td>{row.start}</td><td>{row.end}</td><td>{row.booked}</td><td>{row.amount}</td><td><span className={`status-pill ${row.payment.toLowerCase() === "paid" ? "approved" : "pending"}`}>{row.payment}</span></td><td><span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span></td></tr>)}</tbody></table></div></DashboardShell>;
}
