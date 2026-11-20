"use client";
import { useEffect, useState } from "react";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
import { useAuth } from "../../../lib/auth";

type OwnerAnalytics = { listedEquipment: number; completedRentals: number; totalEarnings: number; monthlyEarnings: { month: string; earnings: number }[] };

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<OwnerAnalytics | null>(null);
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/owner/analytics`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.ok ? r.json() : null).then(setData).catch(() => setData(null));
  }, [token]);
  const earnings = data?.monthlyEarnings.map((item) => item.earnings) || [];
  const labels = data?.monthlyEarnings.map((item) => item.month.split("-")[1]) || [];
  return <DashboardShell title="Owner overview" subtitle="Manage your inventory and incoming rentals."><div className="metric-grid"><div><span>Listed equipment</span><strong>{data?.listedEquipment ?? "—"}</strong><small>Across your inventory</small></div><div><span>Completed rentals</span><strong>{data?.completedRentals ?? "—"}</strong><small>Successfully completed</small></div><div><span>Total earnings</span><strong>${data?.totalEarnings?.toFixed(0) ?? "—"}</strong><small>Paid rental income</small></div></div><div className="dashboard-chart-grid"><RevenueChart values={earnings} labels={labels} total={data?.totalEarnings || 0} /><ActivityChart values={earnings.map((value) => value)} labels={labels} total={data?.completedRentals || 0} /></div></DashboardShell>;
}
