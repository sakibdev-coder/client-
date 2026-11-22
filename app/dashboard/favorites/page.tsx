"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardShell from "../../../components/DashboardShell";
import { apiFetch } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { formatMoney } from "../../../lib/format";
import { rentalUnitLabel } from "../../../lib/rental";

type FavoriteRow = {
  _id: string;
  equipmentId?: {
    _id?: string;
    name?: string;
    category?: string;
    price?: number;
    rentalType?: string;
    location?: string;
    image?: string;
  } | string | null;
};

function equipment(row: FavoriteRow) {
  return row.equipmentId && typeof row.equipmentId === "object" ? row.equipmentId : null;
}

export default function FavoritesPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadFavorites = async (authToken: string) => {
    const data = await apiFetch("/favorites", {}, authToken) as FavoriteRow[];
    setRows(Array.isArray(data) ? data.filter((row) => equipment(row)) : []);
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        await loadFavorites(token!);
      } catch (error) {
        if (!cancelled) {
          setRows([]);
          toast.error(error instanceof Error ? error.message : "Unable to load favorites.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [token]);

  const removeFavorite = async (equipmentId: string) => {
    if (!token) return;
    setRemovingId(equipmentId);
    try {
      await apiFetch(`/favorites/${equipmentId}`, { method: "DELETE" }, token);
      setRows((current) => current.filter((row) => equipment(row)?._id !== equipmentId));
      toast.success("Removed from favorites.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to remove favorite.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <DashboardShell title="Favorites" subtitle="The equipment you saved for later.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Category</th>
              <th>Location</th>
              <th>Rental Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5}>Loading favorites...</td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5}>
                  No favorites yet. Open an equipment page and tap the heart icon to save it.
                </td>
              </tr>
            )}
            {!loading && rows.map((row) => {
              const item = equipment(row);
              if (!item?._id) return null;
              return (
                <tr key={row._id}>
                  <td>
                    <div className="favorite-equipment-cell">
                      {item.image ? <img src={item.image} alt="" /> : null}
                      <strong>{item.name || "Equipment"}</strong>
                    </div>
                  </td>
                  <td>{item.category || "—"}</td>
                  <td>{item.location || "—"}</td>
                  <td>
                    {formatMoney(item.price)} / {rentalUnitLabel(item.rentalType || "Daily")}
                  </td>
                  <td>
                    <Link className="table-action" href={`/equipment/${item._id}`}>View details</Link>
                    <button
                      className="table-action danger"
                      type="button"
                      disabled={removingId === item._id}
                      onClick={() => removeFavorite(item._id!)}
                    >
                      {removingId === item._id ? "Removing..." : "Remove Favorite"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
