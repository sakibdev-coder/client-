"use client";
import { useEffect, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
import { useAuth } from "../../../lib/auth";

type AdminAnalytics = { totalUsers: number; totalEquipment: number; totalBookings: number; pendingApprovals: number; completedRentals: number; totalRevenue: number; monthlyBookings: { month: string; bookings: number }[] };

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/analytics`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null).then(setData).catch(() => setData(null));
  }, [token]);
  const bookings = data?.monthlyBookings.map((item) => item.bookings) || [];
  const labels = data?.monthlyBookings.map((item) => item.month.split("-")[1]) || [];
  return <DashboardShell title="Admin overview" subtitle="Monitor the marketplace and manage all activity."><div className="metric-grid"><div><span>Registered users</span><strong>{data?.totalUsers ?? "—"}</strong><small>All registered accounts</small></div><div><span>Equipment listings</span><strong>{data?.totalEquipment ?? "—"}</strong><small>{data?.pendingApprovals ?? "—"} pending approvals</small></div><div><span>Rental activity</span><strong>{data?.totalBookings ?? "—"}</strong><small>{data?.completedRentals ?? "—"} completed rentals</small></div><div><span>Platform revenue</span><strong>${data?.totalRevenue?.toFixed(0) ?? "—"}</strong><small>Paid transactions</small></div></div><div className="dashboard-chart-grid"><ActivityChart values={bookings} labels={labels} total={data?.totalBookings || 0} /><RevenueChart total={data?.totalRevenue || 0} /></div></DashboardShell>;
}
