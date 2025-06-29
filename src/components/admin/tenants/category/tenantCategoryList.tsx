"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { TenantCategory } from "@/types/tenantCategory";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const PAGE_SIZE = 10;

const TenantCategoryList = () => {
  const [categories, setCategories] = useState<TenantCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      // Count total
      const { count } = await supabase
        .from("tenant_category")
        .select("id", { count: "exact", head: true })
        .ilike("name", `%${search}%`);
      setTotal(count || 0);
      // Fetch data
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("tenant_category")
        .select("id, name")
        .ilike("name", `%${search}%`)
        .order("id", { ascending: true })
        .range(from, to);
      if (error) {
        setError("Gagal mengambil data kategori: " + error.message);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };
    fetchCategories();
  }, [page, search]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleEdit = (cat: TenantCategory) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditError(null);
  };

  const handleEditSave = async (cat: TenantCategory) => {
    setEditError(null);
    if (!editName.trim()) {
      setEditError("Nama kategori tidak boleh kosong.");
      return;
    }
    // Cek duplikat nama (case-insensitive, kecuali id sendiri)
    const { data: exists } = await supabase
      .from("tenant_category")
      .select("id")
      .ilike("name", editName.trim())
      .neq("id", cat.id)
      .maybeSingle();
    if (exists) {
      setEditError("Nama kategori sudah ada.");
      return;
    }
    const { error: updateError } = await supabase
      .from("tenant_category")
      .update({ name: editName.trim() })
      .eq("id", cat.id);
    if (updateError) {
      setEditError("Gagal update kategori: " + updateError.message);
    } else {
      // Update local state
      setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, name: editName.trim() } : c));
      setEditId(null);
      setEditName("");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditName("");
    setEditError(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {loading && <LoadingIndicator message="Memuat kategori..." />}
      <h2 className="text-xl font-bold mb-4">Daftar Kategori Tenant</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Cari nama kategori..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {error && <div className="alert alert-error mb-2 py-2 px-4 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center">Loading...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">Belum ada kategori</td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id}>
                  <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>
                    {editId === cat.id ? (
                      <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td>
                    {editId === cat.id ? (
                      <div className="flex gap-1">
                        <button className="btn btn-xs btn-success" onClick={() => handleEditSave(cat)}>Simpan</button>
                        <button className="btn btn-xs btn-ghost" onClick={handleEditCancel}>Batal</button>
                      </div>
                    ) : (
                      <button className="btn btn-xs btn-info" onClick={() => handleEdit(cat)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editError && <div className="alert alert-error mt-2 py-2 px-4 text-sm">{editError}</div>}
      {/* Pagination dengan daisyUI join */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <div className="join">
          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {Array.from({ length: totalPages || 1 }, (_, i) => (
            <button
              key={i + 1}
              className={`join-item btn btn-sm ${page === i + 1 ? "btn-primary" : "btn-outline"}`}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="join-item btn btn-sm btn-outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantCategoryList;
