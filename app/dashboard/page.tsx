"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarCheck, Heart, LogOut, ShieldCheck, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../lib/auth";
import DashboardShell from "../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../components/DashboardCharts";
import { apiFetch } from "../../lib/api";
import { formatMoney, monthlyBuckets } from "../../lib/format";

type RentalRow = {
  _id: string;
  createdAt: string;
  startDate: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
};

type FavoriteRow = { _id: string };

export default function DashboardPage() {
  const { user, token, loading, signOut } = useAuth();
  const [rentals, setRentals] = useState<RentalRow[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || !token) {
      window.location.href = "/login";
      return;
    }
    if (user.role !== "Customer") return;

    let cancelled = false;

    async function load() {
      setBusy(true);
      try {
        const [rentalData, favoriteData] = await Promise.all([
          apiFetch("/customer/rentals", {}, token) as Promise<RentalRow[]>,
          apiFetch("/favorites", {}, token) as Promise<FavoriteRow[]>
        ]);
        if (cancelled) return;
        setRentals(Array.isArray(rentalData) ? rentalData : []);
        setFavoritesCount(Array.isArray(favoriteData) ? favoriteData.length : 0);
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Unable to load dashboard data.");
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [loading, token, user]);

  const metrics = useMemo(() => {
    const active = rentals.filter((row) =>
      ["Pending", "Confirmed"].includes(row.bookingStatus) && row.paymentStatus !== "Failed"
    ).length;
    const paid = rentals.filter((row) => row.paymentStatus === "Paid");
    const spent = paid.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
    const upcoming = rentals.filter((row) => {
      const start = new Date(row.startDate);
      return start.getTime() >= Date.now() && row.bookingStatus !== "Rejected";
    }).length;
    const activity = monthlyBuckets(rentals.map((row) => ({ date: row.createdAt, amount: row.totalAmount })));
    const spendSeries = monthlyBuckets(
      paid.map((row) => ({ date: row.createdAt, amount: row.totalAmount }))
    );
    return {
      active,
      upcoming,
      spent,
      activity,
      spendSeries,
      totalBookings: rentals.length
    };
  }, [rentals]);

  if (loading || !user) {
    return <main className="status-page"><div className="status-card"><p>Checking your secure session...</p></div></main>;
  }

  return (
    <DashboardShell title={`Welcome, ${user.name.split(" ")[0]}`} subtitle="Here is what is happening with your rentals.">
      <div className="metric-grid customer-metrics">
        <div>
          <span><CalendarCheck size={15} /> Active rentals</span>
          <strong>{busy ? "—" : metrics.active}</strong>
          <small>{busy ? "Loading..." : `${metrics.upcoming} starting soon`}</small>
        </div>
        <div>
          <span><Heart size={15} /> Favorites</span>
          <strong>{busy ? "—" : favoritesCount}</strong>
          <small>Ready to revisit</small>
        </div>
        <div>
          <span><Wallet size={15} /> Total spent</span>
          <strong>{busy ? "—" : formatMoney(metrics.spent)}</strong>
          <small>{metrics.totalBookings} total bookings</small>
        </div>
        <div>
          <span><ShieldCheck size={15} /> Account</span>
          <strong>{user.role}</strong>
          <small>Verified profile</small>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <ActivityChart
          values={metrics.activity.counts}
          labels={metrics.activity.labels}
          total={metrics.totalBookings}
          title="Booking activity"
          subtitle="Last 6 months"
          unit="bookings"
        />
        <RevenueChart
          values={metrics.spendSeries.totals.map((value) => Math.max(0, Math.round(value)))}
          labels={metrics.spendSeries.labels}
          total={Math.round(metrics.spent)}
          title="Spending"
          subtitle="Paid rentals"
          unit="total spent"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-icon"><ShieldCheck /></span>
          <h2>Your account is protected</h2>
          <p>Private routes stay available after reload while your session cookie and JWT remain valid.</p>
          <span className="role-badge">{user.role}</span>
        </div>
        <div className="dashboard-card">
          <h2>Quick actions</h2>
          <Link className="dashboard-action" href="/equipment">Explore equipment <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/rentals">View my rentals <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/favorites">Open favorites <ArrowLeft size={16} /></Link>
          <Link className="dashboard-action" href="/dashboard/profile">Edit profile <ArrowLeft size={16} /></Link>
          <button
            className="dashboard-action"
            type="button"
            onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}
          >
            Sign out securely <LogOut size={16} />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
