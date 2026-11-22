"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Package, Users } from "lucide-react";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { formatMoney } from "../../../lib/format";

type AdminAnalytics = {
  totalUsers: number;
  totalEquipment: number;
  totalBookings: number;
  pendingApprovals: number;
  completedRentals: number;
  totalRevenue: number;
  monthlyBookings: { month: string; bookings: number }[];
  monthlyRevenue?: { month: string; revenue: number }[];
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(value: string) {
  const parts = value.split("-");
  const monthNumber = Number(parts[1]);
  if (!monthNumber) return value;
  return monthNames[monthNumber - 1] || value;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const analytics = await apiFetch("/admin/analytics", {}, token) as AdminAnalytics;
        if (!cancelled) setData(analytics);
      } catch (error) {
        if (!cancelled) {
          setData(null);
          toast.error(error instanceof Error ? error.message : "Unable to load admin analytics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [token]);

  const bookings = data?.monthlyBookings.map((item) => item.bookings) || [];
  const bookingLabels = data?.monthlyBookings.map((item) => monthLabel(item.month)) || [];
  const revenue = data?.monthlyRevenue?.map((item) => Math.round(item.revenue)) || [];
  const revenueLabels = data?.monthlyRevenue?.map((item) => monthLabel(item.month)) || [];

  return (
    <DashboardShell title="Admin overview" subtitle="Monitor the marketplace and manage all activity.">
      <div className="metric-grid">
        <div>
          <span>Registered users</span>
          <strong>{loading ? "—" : data?.totalUsers ?? 0}</strong>
          <small>All registered accounts</small>
        </div>
        <div>
          <span>Equipment listings</span>
          <strong>{loading ? "—" : data?.totalEquipment ?? 0}</strong>
          <small>{data?.pendingApprovals ?? 0} pending approvals</small>
        </div>
        <div>
          <span>Rental activity</span>
          <strong>{loading ? "—" : data?.totalBookings ?? 0}</strong>
          <small>{data?.completedRentals ?? 0} completed rentals</small>
        </div>
        <div>
          <span>Platform revenue</span>
          <strong>{loading ? "—" : formatMoney(data?.totalRevenue || 0)}</strong>
          <small>Paid transactions</small>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <ActivityChart
          values={bookings.length ? bookings : [0]}
          labels={bookingLabels.length ? bookingLabels : ["—"]}
          total={data?.totalBookings || 0}
          title="Monthly bookings"
          subtitle="Platform activity"
          unit="bookings"
        />
        <RevenueChart
          values={revenue.length ? revenue : [0]}
          labels={revenueLabels.length ? revenueLabels : ["—"]}
          total={Math.round(data?.totalRevenue || 0)}
          title="Revenue"
          subtitle="Paid volume"
          unit="total"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-icon"><Users /></span>
          <h2>Platform control</h2>
          <p>Approve equipment, manage roles, and monitor every rental payment from one admin workspace.</p>
        </div>
        <div className="dashboard-card">
          <h2>Quick actions</h2>
          <Link className="dashboard-action" href="/dashboard/admin/users">All users <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/admin/equipment">All equipment <Package size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/admin/rentals">All rentals <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/profile">My profile <ArrowLeft size={16} /></Link>
        </div>
      </div>
    </DashboardShell>
  );
}
