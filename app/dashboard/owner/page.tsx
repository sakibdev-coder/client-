"use client";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
export default function OwnerDashboard() { return <DashboardShell title="Owner overview" subtitle="Manage your inventory and incoming rentals."><div className="metric-grid"><div><span>Equipment</span><strong>8</strong><small>6 approved</small></div><div><span>Active rentals</span><strong>3</strong><small>2 confirmed</small></div><div><span>Monthly earnings</span><strong>$482</strong><small>18% this month</small></div></div><div className="dashboard-chart-grid"><RevenueChart /><ActivityChart /></div></DashboardShell>; }
