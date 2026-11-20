"use client";
import Link from "next/link";
import DashboardShell from "../../../components/DashboardShell";

export default function FavoritesPage() {
  return <DashboardShell title="Favorites" subtitle="The equipment you saved for later."><div className="table-wrap"><table><thead><tr><th>Equipment</th><th>Category</th><th>Daily rate</th><th>Actions</th></tr></thead><tbody><tr><td><strong>Sony A7 IV Camera</strong></td><td>Photography</td><td>$42</td><td><Link className="table-action" href="/equipment/1">View details</Link> <button className="table-action danger">Remove</button></td></tr><tr><td><strong>Cedar Camp Set</strong></td><td>Outdoor</td><td>$28</td><td><Link className="table-action" href="/equipment/2">View details</Link> <button className="table-action danger">Remove</button></td></tr></tbody></table></div></DashboardShell>;
}
