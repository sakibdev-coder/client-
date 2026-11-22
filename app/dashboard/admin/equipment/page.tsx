"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { categories } from "../../../../data/equipment";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { formatMoney, statusClass } from "../../../../lib/format";
import type { EquipmentItem } from "../../../../lib/types";

const equipmentCategories = categories.filter((item) => item !== "All equipment");

type EditForm = {
  name: string;
  description: string;
  category: string;
  location: string;
  price: string;
  rentalType: "Daily" | "Weekly" | "Monthly";
  quantity: string;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
  status: "Pending" | "Approved" | "Rejected";
};

function ownerLabel(item: EquipmentItem) {
  if (item.ownerId && typeof item.ownerId === "object") {
    return `${item.ownerId.name || "Owner"}${item.ownerId.email ? ` (${item.ownerId.email})` : ""}`;
  }
  return "Owner";
}

function toForm(item: EquipmentItem): EditForm {
  return {
    name: item.name || "",
    description: item.description || "",
    category: item.category || equipmentCategories[0],
    location: item.location || "",
    price: String(item.price ?? ""),
    rentalType: item.rentalType || "Daily",
    quantity: String(item.quantity ?? 1),
    condition: item.condition || "Good",
    brand: item.brand || "",
    model: item.model || "",
    image: item.image || "",
    terms: item.terms || "",
    status: item.status || "Pending"
  };
}

export default function AdminEquipmentPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EquipmentItem | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (authToken: string) => {
    const data = await apiFetch("/admin/equipment", {}, authToken) as EquipmentItem[];
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
          toast.error(error instanceof Error ? error.message : "Unable to load equipment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => { cancelled = true; };
  }, [token]);

  const setStatus = async (item: EquipmentItem, status: "Approved" | "Rejected" | "Pending") => {
    if (!token) return;
    setBusyId(item._id);
    try {
      const updated = await apiFetch(`/admin/equipment/${item._id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      }, token) as EquipmentItem;
      setRows((current) => current.map((row) => (row._id === item._id ? { ...row, status: updated.status } : row)));
      toast.success(`${item.name} marked as ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (item: EquipmentItem) => {
    if (!token) return;
    if (!window.confirm(`Delete "${item.name}" permanently?`)) return;
    setBusyId(item._id);
    try {
      await apiFetch(`/equipment/${item._id}`, { method: "DELETE" }, token);
      setRows((current) => current.filter((row) => row._id !== item._id));
      toast.success("Equipment deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete equipment.");
    } finally {
      setBusyId(null);
    }
  };

  const saveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !editing || !form) return;
    setBusyId(editing._id);
    try {
      const updated = await apiFetch(`/equipment/${editing._id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          location: form.location.trim(),
          price: Number(form.price),
          rentalType: form.rentalType,
          quantity: Number(form.quantity),
          condition: form.condition,
          brand: form.brand.trim(),
          model: form.model.trim(),
          image: form.image.trim(),
          terms: form.terms.trim()
        })
      }, token) as EquipmentItem;

      if (form.status !== updated.status) {
        await apiFetch(`/admin/equipment/${editing._id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: form.status })
        }, token);
        updated.status = form.status;
      }

      setRows((current) => current.map((row) => (row._id === editing._id ? { ...row, ...updated } : row)));
      setEditing(null);
      setForm(null);
      toast.success("Equipment updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update equipment.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardShell title="All equipment" subtitle="Approve, reject, update, or delete marketplace listings.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6}>Loading equipment...</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={6}>No equipment found.</td></tr>}
            {!loading && rows.map((row) => (
              <tr key={row._id}>
                <td><strong>{row.name}</strong></td>
                <td>{ownerLabel(row)}</td>
                <td>{row.category}</td>
                <td>{formatMoney(row.price)}</td>
                <td><span className={`status-pill ${statusClass(row.status)}`}>{row.status}</span></td>
                <td>
                  <Link className="table-action" href={`/equipment/${row._id}`}>View</Link>
                  <button className="table-action" type="button" disabled={busyId === row._id} onClick={() => setStatus(row, "Approved")}>Approve</button>
                  <button className="table-action danger" type="button" disabled={busyId === row._id} onClick={() => setStatus(row, "Rejected")}>Reject</button>
                  <button
                    className="table-action"
                    type="button"
                    onClick={() => {
                      setEditing(row);
                      setForm(toForm(row));
                    }}
                  >
                    Update
                  </button>
                  <button className="table-action danger" type="button" disabled={busyId === row._id} onClick={() => removeItem(row)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && form && (
        <div className="modal-backdrop" onClick={() => busyId !== editing._id && setEditing(null)}>
          <div className="booking-modal owner-edit-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" disabled={busyId === editing._id} onClick={() => setEditing(null)}>×</button>
            <form className="modal-body" onSubmit={saveEdit}>
              <h2>Update equipment</h2>
              <div className="profile-grid">
                <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>
                  Category
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {equipmentCategories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>Location<input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
                <label>Price<input required type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
                <label>
                  Rental type
                  <select value={form.rentalType} onChange={(e) => setForm({ ...form, rentalType: e.target.value as EditForm["rentalType"] })}>
                    <option>Daily</option><option>Weekly</option><option>Monthly</option>
                  </select>
                </label>
                <label>Quantity<input required type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
                <label>
                  Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EditForm["status"] })}>
                    <option>Pending</option><option>Approved</option><option>Rejected</option>
                  </select>
                </label>
                <label>Condition<input value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} /></label>
                <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
                <label>Model<input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label>
                <label className="wide">Image URL<input type="url" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
                <label className="wide">Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                <label className="wide">Terms<textarea rows={2} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></label>
              </div>
              <button className="button button-primary full-button" type="submit" disabled={busyId === editing._id}>
                {busyId === editing._id ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
