"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LoadingIndicator from "@/components/ui/LoadingIndicator";


const AddTenantCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    // Cek apakah nama sudah ada (case-insensitive)
    const { data: exists, error: fetchError } = await supabase
      .from("tenant_category")
      .select("id, name")
      .ilike("name", name.trim()) // ilike = case-insensitive
      .maybeSingle();
    if (fetchError) {
      setError("Gagal cek kategori: " + fetchError.message);
      setLoading(false);
      return;
    }
    if (exists) {
      setError("Nama kategori sudah ada.");
      setLoading(false);
      return;
    }
    // Insert ke supabase
    const { error: insertError } = await supabase
      .from("tenant_category")
      .insert([{ name: name.trim() }]);
    if (insertError) {
      setError("Gagal tambah kategori: " + insertError.message);
    } else {
      setSuccess("Kategori berhasil ditambahkan.");
      setName("");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {loading && <LoadingIndicator message="Menyimpan kategori..." />}
      <h3 className="font-bold text-lg mb-2">Tambah Kategori Tenant</h3>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nama Kategori</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Contoh: Makanan, Minuman, dll"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-error py-2 px-4 text-sm">{error}</div>}
      {success && <div className="alert alert-success py-2 px-4 text-sm">{success}</div>}
      <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Kategori"}
      </button>
    </form>
  );
};

export default AddTenantCategory;
