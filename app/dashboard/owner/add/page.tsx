"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import DashboardShell from "../../../../components/DashboardShell";
import { categories } from "../../../../data/equipment";
import { apiFetch } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth";
import { hasImgbbKey, uploadToImgbb } from "../../../../lib/imgbb";

const equipmentCategories = categories.filter((item) => item !== "All equipment");

type FormState = {
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

const emptyForm: FormState = {
  name: "",
  description: "",
  category: equipmentCategories[0],
  location: "",
  price: "",
  rentalType: "Daily",
  quantity: "1",
  condition: "Good",
  brand: "",
  model: "",
  image: "",
  terms: ""
};

export default function AddEquipmentPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setForm((current) => ({ ...current, image: url }));
      toast.success("Image uploaded to imgbb.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      toast.error("Please sign in again.");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Upload an image or provide an image URL.");
      return;
    }

    setBusy(true);
    try {
      await apiFetch("/equipment", {
        method: "POST",
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
          terms: form.terms.trim(),
          ownerInformation: {
            name: user?.name,
            email: user?.email
          }
        })
      }, token);

      toast.success("Equipment submitted for approval.");
      router.push("/dashboard/owner/equipment");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add equipment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell title="Add equipment" subtitle="Submit new gear for admin approval. Status starts as Pending.">
      <form className="profile-form" onSubmit={submit}>
        <div className="profile-grid">
          <label>
            Equipment name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bosch Circular Saw" />
          </label>
          <label>
            Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {equipmentCategories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Location
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City or area" />
          </label>
          <label>
            Rental price
            <input required type="number" min="1" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <label>
            Rental type
            <select value={form.rentalType} onChange={(e) => setForm({ ...form, rentalType: e.target.value as FormState["rentalType"] })}>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </label>
          <label>
            Available quantity
            <input required type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </label>
          <label>
            Equipment condition
            <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </label>
          <label>
            Brand
            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          </label>
          <label>
            Model
            <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          </label>
          <label>
            Status
            <input value="Pending" readOnly />
          </label>
          <label className="wide">
            Equipment image {hasImgbbKey() ? "(imgbb upload)" : "(paste URL or add IMGBB key)"}
            <input
              type="file"
              accept="image/*"
              disabled={uploading || !hasImgbbKey()}
              onChange={onFileChange}
            />
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://i.ibb.co/..."
              style={{ marginTop: 8 }}
            />
            {form.image && (
              <img src={form.image} alt="Preview" className="equipment-image-preview" />
            )}
            {!hasImgbbKey() && (
              <small className="field-hint">Set `NEXT_PUBLIC_IMGBB_API_KEY` in `.env.local` to enable direct imgbb uploads.</small>
            )}
          </label>
          <label className="wide">
            Description
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="wide">
            Rental terms and conditions
            <textarea rows={3} value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
          </label>
          <label className="wide">
            Owner information
            <input readOnly value={`${user?.name || ""} (${user?.email || ""})`} />
          </label>
        </div>
        <button className="button button-dark" type="submit" disabled={busy || uploading}>
          {busy ? "Submitting..." : uploading ? "Uploading image..." : "Submit for approval"}
        </button>
      </form>
    </DashboardShell>
  );
}
