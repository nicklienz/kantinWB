"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MenuVariant } from "@/types/menu.types";

interface MenuItemSearch {
  id: string;
  name: string;
}

export default function AddMenuVariant({ menuItemId: initialMenuItemId }: { menuItemId?: string }) {
  const [variants, setVariants] = useState<MenuVariant[]>([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<MenuItemSearch[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemSearch | null>(null);
  const [menuItemId, setMenuItemId] = useState<string>(initialMenuItemId || "");

  // Search menu item
  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    let active = true;
    const fetch = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .order("name");
      if (active) setSearchResults(data || []);
    };
    fetch();
    return () => { active = false; };
  }, [search]);

  // Set selected menu item
  useEffect(() => {
    if (initialMenuItemId) setMenuItemId(initialMenuItemId);
  }, [initialMenuItemId]);

  const fetchVariants = async () => {
    if (!menuItemId) return; // Cegah query jika menuItemId kosong
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("menu_variants")
      .select("id, name, price")
      .eq("menu_item_id", menuItemId)
      .order("name");
    if (error) setError(error.message);
    setVariants(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (menuItemId) fetchVariants();
  }, [menuItemId, fetchVariants]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!form.name || !form.price) {
      setError("Nama dan harga harus diisi.");
      setLoading(false);
      return;
    }
    if (!menuItemId) {
      setError("Menu belum dipilih.");
      setLoading(false);
      return;
    }
    if (editId) {
      // Update
      const { error } = await supabase
        .from("menu_variants")
        .update({ name: form.name, price: Number(form.price) })
        .eq("id", editId);
      if (error) setError(error.message);
      else setSuccess("Varian berhasil diupdate.");
    } else {
      // Insert
      const { error } = await supabase
        .from("menu_variants")
        .insert({ menu_item_id: menuItemId, name: form.name, price: Number(form.price) });
      if (error) setError(error.message);
      else setSuccess("Varian berhasil ditambahkan.");
    }
    setForm({ name: "", price: "" });
    setEditId(null);
    await fetchVariants();
    setLoading(false);
  };

  const handleEdit = (variant: MenuVariant) => {
    setForm({ name: variant.name, price: variant.price.toString() });
    setEditId(variant.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus varian ini?")) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("menu_variants").delete().eq("id", id);
    if (error) setError(error.message);
    else setSuccess("Varian berhasil dihapus.");
    await fetchVariants();
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Kelola Varian Menu</h3>
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered w-full sm:w-1/2"
          placeholder="Cari Menu..."
          value={selectedMenuItem ? selectedMenuItem.name : search}
          onChange={e => {
            setSearch(e.target.value);
            setSelectedMenuItem(null);
            setMenuItemId("");
          }}
          disabled={!!selectedMenuItem}
        />
        {search.length >= 2 && searchResults.length > 0 && !selectedMenuItem && (
          <ul className="menu bg-base-100 shadow rounded mt-1 absolute z-10 w-full sm:w-1/2">
            {searchResults.map(item => (
              <li key={item.id}>
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => {
                    setSelectedMenuItem(item);
                    setMenuItemId(item.id);
                    setSearch("");
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedMenuItem && (
          <div className="mt-2 flex items-center gap-2">
            <span className="badge badge-info">{selectedMenuItem.name}</span>
            <button
              type="button"
              className="btn btn-xs btn-ghost"
              onClick={() => {
                setSelectedMenuItem(null);
                setMenuItemId("");
                setVariants([]);
              }}
            >Ganti</button>
          </div>
        )}
      </div>
      <form className="flex flex-col sm:flex-row gap-2 mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input input-bordered w-full sm:w-1/3"
          name="name"
          placeholder="Nama Varian"
          value={form.name}
          onChange={handleChange}
          required
          disabled={!menuItemId}
        />
        <input
          type="number"
          className="input input-bordered w-full sm:w-1/3"
          name="price"
          placeholder="Harga"
          value={form.price}
          onChange={handleChange}
          min={0}
          required
          disabled={!menuItemId}
        />
        <button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={loading || !menuItemId}>
          {editId ? "Simpan Perubahan" : "Tambah Varian"}
        </button>
        {editId && (
          <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={() => { setForm({ name: "", price: "" }); setEditId(null); }}>
            Batal
          </button>
        )}
      </form>
      {error && <div className="alert alert-error py-2 px-4 text-sm mb-2">{error}</div>}
      {success && <div className="alert alert-success py-2 px-4 text-sm mb-2">{success}</div>}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Varian</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4}><span className="loading loading-spinner loading-md"></span></td></tr>
            ) : variants.length === 0 ? (
              <tr><td colSpan={4} className="text-center">Belum ada varian</td></tr>
            ) : (
              variants.map((v, i) => (
                <tr key={v.id}>
                  <td>{i + 1}</td>
                  <td>{v.name}</td>
                  <td>Rp {v.price.toLocaleString("id-ID")}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-info" onClick={() => handleEdit(v)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(v.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
