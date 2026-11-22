"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { categories } from "../../../../data/equipment";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { formatMoney, statusClass } from "../../../../lib/format";
import { hasImgbbKey, uploadToImgbb } from "../../../../lib/imgbb";
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
};

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
    terms: item.terms || ""
  };
}

export default function OwnerEquipmentPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EquipmentItem | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async (authToken: string) => {
    const data = await apiFetch("/owner/equipment", {}, authToken) as EquipmentItem[];
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

  const openEdit = (item: EquipmentItem) => {
    setEditing(item);
    setForm(toForm(item));
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setForm({ ...form, image: url });
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const saveEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !editing || !form) return;
    setBusy(true);
    try {
      await apiFetch(`/equipment/${editing._id}`, {
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
      }, token);
      toast.success("Equipment updated. Status set to Pending for re-approval.");
      setEditing(null);
      setForm(null);
      await load(token);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update equipment.");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (item: EquipmentItem) => {
    if (!token) return;
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/equipment/${item._id}`, { method: "DELETE" }, token);
      toast.success("Equipment deleted.");
      setRows((current) => current.filter((row) => row._id !== item._id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete equipment.");
    }
  };

  return (
    <DashboardShell title="My equipment" subtitle="Manage all equipment you have listed.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Equipment name</th>
              <th>Category</th>
              <th>Rental price</th>
              <th>Available quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6}>Loading your equipment...</td></tr>}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6}>
                  No listings yet. <Link href="/dashboard/owner/add">Add equipment</Link> to get started.
                </td>
              </tr>
            )}
            {!loading && rows.map((row) => (
              <tr key={row._id}>
                <td><strong>{row.name}</strong></td>
                <td>{row.category}</td>
                <td>{formatMoney(row.price)}</td>
                <td>{row.quantity}</td>
                <td><span className={`status-pill ${statusClass(row.status)}`}>{row.status || "Pending"}</span></td>
                <td>
                  <Link className="table-action" href={`/equipment/${row._id}`}>View Details</Link>
                  <button className="table-action" type="button" onClick={() => openEdit(row)}>Update</button>
                  <button className="table-action danger" type="button" onClick={() => removeItem(row)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && form && (
        <div className="modal-backdrop" onClick={() => !busy && setEditing(null)}>
          <div className="booking-modal owner-edit-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" disabled={busy} onClick={() => setEditing(null)}>×</button>
            <form className="modal-body" onSubmit={saveEdit}>
              <h2>Update equipment</h2>
              <p className="modal-location">Saving will set status back to Pending for admin review.</p>
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
                  Condition
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                    <option>Excellent</option><option>Good</option><option>Fair</option>
                  </select>
                </label>
                <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
                <label>Model<input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label>
                <label className="wide">
                  Image
                  <input type="file" accept="image/*" disabled={!hasImgbbKey() || uploading} onChange={onFileChange} />
                  <input type="url" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={{ marginTop: 8 }} />
                </label>
                <label className="wide">Description<textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
                <label className="wide">Terms<textarea rows={2} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} /></label>
              </div>
              <button className="button button-primary full-button" type="submit" disabled={busy || uploading}>
                {busy ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
