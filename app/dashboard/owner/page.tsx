"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Package, Plus } from "lucide-react";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { formatMoney } from "../../../lib/format";

type OwnerAnalytics = {
  listedEquipment: number;
  completedRentals: number;
  totalEarnings: number;
  monthlyEarnings: { month: string; earnings: number }[];
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(value: string) {
  const parts = value.split("-");
  const monthNumber = Number(parts[1]);
  if (!monthNumber) return value;
  return monthNames[monthNumber - 1] || value;
}

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<OwnerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const analytics = await apiFetch("/owner/analytics", {}, token) as OwnerAnalytics;
        if (!cancelled) setData(analytics);
      } catch (error) {
        if (!cancelled) {
          setData(null);
          toast.error(error instanceof Error ? error.message : "Unable to load owner analytics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [token]);

  const earnings = data?.monthlyEarnings.map((item) => Math.round(item.earnings)) || [];
  const labels = data?.monthlyEarnings.map((item) => monthLabel(item.month)) || [];

  return (
    <DashboardShell title="Owner overview" subtitle="Track your inventory performance and rental earnings.">
      <div className="metric-grid">
        <div>
          <span>Listed equipment</span>
          <strong>{loading ? "—" : data?.listedEquipment ?? 0}</strong>
          <small>Across your inventory</small>
        </div>
        <div>
          <span>Completed rentals</span>
          <strong>{loading ? "—" : data?.completedRentals ?? 0}</strong>
          <small>Successfully completed</small>
        </div>
        <div>
          <span>Total earnings</span>
          <strong>{loading ? "—" : formatMoney(data?.totalEarnings || 0)}</strong>
          <small>Paid rental income</small>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <RevenueChart
          values={earnings.length ? earnings : [0]}
          labels={labels.length ? labels : ["—"]}
          total={Math.round(data?.totalEarnings || 0)}
          title="Monthly earnings"
          subtitle="Paid bookings"
          unit="total"
        />
        <ActivityChart
          values={earnings.length ? earnings : [0]}
          labels={labels.length ? labels : ["—"]}
          total={data?.completedRentals || 0}
          title="Earnings activity"
          subtitle="Last months"
          unit="completed"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-icon"><Package /></span>
          <h2>Grow your inventory</h2>
          <p>Add equipment for admin approval, then track bookings and earnings from one place.</p>
        </div>
        <div className="dashboard-card">
          <h2>Quick actions</h2>
          <Link className="dashboard-action" href="/dashboard/owner/add">Add equipment <Plus size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/owner/equipment">My equipment <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/owner/rentals">Equipment rentals <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/profile">My profile <ArrowLeft size={16} /></Link>
        </div>
      </div>
    </DashboardShell>
  );
}
