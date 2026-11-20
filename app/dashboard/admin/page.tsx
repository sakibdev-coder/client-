"use client";
import DashboardShell from "../../../components/DashboardShell";
import { ActivityChart, RevenueChart } from "../../../components/DashboardCharts";
export default function AdminDashboard() { return <DashboardShell title="Admin overview" subtitle="Monitor the marketplace and manage all activity."><div className="metric-grid"><div><span>Registered users</span><strong>248</strong><small>24 this month</small></div><div><span>Equipment listings</span><strong>86</strong><small>12 pending</small></div><div><span>Rental activity</span><strong>124</strong><small>18 confirmed</small></div></div><div className="dashboard-chart-grid"><ActivityChart /><RevenueChart /></div></DashboardShell>; }
