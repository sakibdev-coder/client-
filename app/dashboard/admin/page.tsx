"use client";
import DashboardShell from "../../../components/DashboardShell";
export default function AdminDashboard() { return <DashboardShell title="Admin overview" subtitle="Monitor the marketplace and manage all activity."><div className="metric-grid"><div><span>Registered users</span><strong>248</strong></div><div><span>Equipment listings</span><strong>86</strong></div><div><span>Rental activity</span><strong>124</strong></div></div></DashboardShell>; }
