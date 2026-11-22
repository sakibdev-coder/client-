"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { formatDate } from "../../../../lib/format";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "Owner" | "Admin";
  createdAt?: string;
};

export default function AdminUsersPage() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async (authToken: string) => {
    const data = await apiFetch("/admin/users", {}, authToken) as AdminUser[];
    setRows(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        await load(token!);
      } catch (error) {
        if (!cancelled) {
          setRows([]);
          toast.error(error instanceof Error ? error.message : "Unable to load users.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [token]);

  const changeRole = async (target: AdminUser, role: AdminUser["role"]) => {
    if (!token || target.role === role) return;
    setSavingId(target.id);
    try {
      const updated = await apiFetch(`/admin/users/${target.id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role })
      }, token) as AdminUser;
      setRows((current) => current.map((row) => (row.id === target.id ? { ...row, role: updated.role } : row)));
      toast.success(`${updated.name} is now ${updated.role}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update role.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <DashboardShell title="All users" subtitle="Change roles and manage registered accounts.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registration Date</th>
              <th>Manage Users</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5}>Loading users...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={5}>No users found.</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  {row.id === user?.id ? <small style={{ display: "block", color: "#809087" }}>You</small> : null}
                </td>
                <td>{row.email}</td>
                <td>
                  <select
                    value={row.role}
                    disabled={savingId === row.id}
                    onChange={(event) => changeRole(row, event.target.value as AdminUser["role"])}
                  >
                    <option>Customer</option>
                    <option>Owner</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td>{formatDate(row.createdAt)}</td>
                <td>
                  <button
                    className="table-action"
                    type="button"
                    disabled={savingId === row.id}
                    onClick={() => changeRole(row, row.role === "Owner" ? "Customer" : "Owner")}
                  >
                    {savingId === row.id ? "Saving..." : "Quick toggle Owner"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
