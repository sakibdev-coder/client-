"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../components/DashboardShell";
import { apiFetch } from "../../../lib/api";
import { useAuth, type User } from "../../../lib/auth";

type ProfileForm = {
  name: string;
  photo: string;
  phone: string;
  address: string;
};

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    photo: "",
    phone: "",
    address: ""
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name || "",
      photo: user.photo || "",
      phone: user.phone || "",
      address: user.address || ""
    });
  }, [user]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      toast.error("Please sign in again.");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setBusy(true);
    try {
      const data = await apiFetch(
        "/profile",
        {
          method: "PUT",
          body: JSON.stringify({
            name: form.name.trim(),
            photo: form.photo.trim(),
            phone: form.phone.trim(),
            address: form.address.trim()
          })
        },
        token
      ) as { user: User };

      updateUser(data.user);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardShell title="My profile" subtitle="Keep your rental and account information up to date.">
      <form className="profile-form" onSubmit={submit}>
        <div className="profile-avatar">
          {form.photo || user?.photo
            ? <img src={form.photo || user?.photo} alt={user?.name || "Profile"} />
            : user?.name?.[0] || "U"}
        </div>

        <div className="profile-grid">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Your full name"
            />
          </label>
          <label>
            Email
            <input type="email" value={user?.email || ""} readOnly />
          </label>
          <label className="wide">
            Profile image URL
            <input
              type="url"
              value={form.photo}
              onChange={(event) => setForm({ ...form, photo: event.target.value })}
              placeholder="https://i.ibb.co/..."
            />
          </label>
          <label>
            Phone number
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="+880..."
            />
          </label>
          <label>
            Role
            <input value={user?.role || "Customer"} readOnly />
          </label>
          <label className="wide">
            Address
            <textarea
              rows={3}
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              placeholder="Street, area, city"
            />
          </label>
        </div>

        <button className="button button-dark" type="submit" disabled={busy}>
          {busy ? "Saving..." : "Update profile"}
        </button>
      </form>
    </DashboardShell>
  );
}
