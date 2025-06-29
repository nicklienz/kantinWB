"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { TenantCategory } from "@/types/tenantCategory";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const AddTenant = () => {
  const [form, setForm] = useState({
    name: "",
    owner: "",
    phone: "",
    email: "",
    address: "",
    openhour: "",
    closehour: "",
    description: "",
    tenantCategoryId: "",
    imageUrl: "",
    qrisUrl: "",
  });
  const [categories, setCategories] = useState<TenantCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [qrisFile, setQrisFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("tenant_category").select("id, name").order("name");
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (jpg, png, webp, dll)");
      return;
    }
    if (name === "imageFile") setImageFile(file);
    if (name === "qrisFile") setQrisFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    // Validasi jam buka < jam tutup
    if (form.openhour >= form.closehour) {
      setError("Jam buka harus lebih awal dari jam tutup.");
      setLoading(false);
      return;
    }
    // Validasi email/phone unik
    const { data: exists, error: checkError } = await supabase
      .from("tenant")
      .select("id")
      .or(`email.eq.${form.email},phone.eq.${form.phone}`)
      .maybeSingle();
    if (checkError) {
      setError("Gagal cek data tenant: " + checkError.message);
      setLoading(false);
      return;
    }
    if (exists) {
      setError("Email atau No. HP sudah terdaftar.");
      setLoading(false);
      return;
    }
    // Cek email di tabel profile dan role harus customer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("email", form.email)
      .maybeSingle();
    if (profileError) {
      setError("Gagal cek data profile: " + profileError.message);
      setLoading(false);
      return;
    }
    if (!profile) {
      setError("Email belum terdaftar di sistem. Silakan gunakan email yang sudah terdaftar.");
      setLoading(false);
      return;
    }
    if (profile.role !== "customer") {
      setError("Email sudah terdaftar dengan role lain. Tidak bisa didaftarkan sebagai tenant.");
      setLoading(false);
      return;
    }
    // Update role profile menjadi tenant
    const { error: updateProfileError } = await supabase
      .from("profile")
      .update({ role: "tenant" })
      .eq("id", profile.id);
    if (updateProfileError) {
      setError("Gagal update role profile: " + updateProfileError.message);
      setLoading(false);
      return;
    }
    // Insert ke supabase (tanpa image/qris dulu)
    const { data: inserted, error: insertError } = await supabase.from("tenant").insert([
      {
        name: form.name,
        owner: form.owner,
        phone: form.phone,
        email: form.email,
        address: form.address,
        openhour: form.openhour,
        closehour: form.closehour,
        description: form.description,
        tenant_category: form.tenantCategoryId ? Number(form.tenantCategoryId) : null,
        image_url: null,
        qris_url: null,
      },
    ]).select("id").single();
    if (insertError || !inserted) {
      setError("Gagal tambah tenant: " + (insertError?.message || ""));
      setLoading(false);
      return;
    }
    const tenantId = inserted.id;
    let imageUrl = "";
    let qrisUrl = "";
    // Upload image jika ada
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `${tenantId}.${ext}`;
      const { data: imgData, error: imgErr } = await supabase.storage.from("tenant-images").upload(`images/${fileName}`, imageFile, { upsert: true });
      if (imgErr) {
        setError("Gagal upload gambar tenant: " + imgErr.message);
        setLoading(false);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("tenant-images").getPublicUrl(`images/${fileName}`);
      imageUrl = publicUrl.publicUrl;
    }
    // Upload qris jika ada
    if (qrisFile) {
      const ext = qrisFile.name.split(".").pop();
      const fileName = `${tenantId}.${ext}`;
      const { data: qrisData, error: qrisErr } = await supabase.storage.from("tenant-qris").upload(`qris/${fileName}`, qrisFile, { upsert: true });
      if (qrisErr) {
        setError("Gagal upload gambar QRIS: " + qrisErr.message);
        setLoading(false);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("tenant-qris").getPublicUrl(`qris/${fileName}`);
      qrisUrl = publicUrl.publicUrl;
    }
    // Update tenant dengan url image/qris jika ada
    if (imageUrl || qrisUrl) {
      const { error: updateError } = await supabase.from("tenant").update({
        image_url: imageUrl || null,
        qris_url: qrisUrl || null,
      }).eq("id", tenantId);
      if (updateError) {
        setError("Gagal update url gambar: " + updateError.message);
        setLoading(false);
        return;
      }
    }
    setSuccess("Tenant berhasil ditambahkan.");
    setForm({
      name: "",
      owner: "",
      phone: "",
      email: "",
      address: "",
      openhour: "",
      closehour: "",
      description: "",
      tenantCategoryId: "",
      imageUrl: "",
      qrisUrl: "",
    });
    setImageFile(null);
    setQrisFile(null);
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {loading && <LoadingIndicator message="Menyimpan tenant..." />}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Tambah Tenant Baru</h3>
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Nama Tenant</span></label>
        <input type="text" className="input input-bordered w-full" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Nama Pemilik</span></label>
        <input type="text" className="input input-bordered w-full" name="owner" value={form.owner} onChange={handleChange} required />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Email</span></label>
        <input type="email" className="input input-bordered w-full" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">No. HP Pemilik</span></label>
        <input type="text" className="input input-bordered w-full" name="phone" value={form.phone} onChange={handleChange} required />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Alamat Tenant</span></label>
        <input type="text" className="input input-bordered w-full" name="address" value={form.address} onChange={handleChange} required />
      </div>
      <div className="form-control flex gap-2">
        <div className="w-1/2">
          <label className="label"><span className="label-text">Jam Buka</span></label>
          <input type="time" className="input input-bordered w-full" name="openhour" value={form.openhour} onChange={handleChange} required />
        </div>
        <div className="w-1/2">
          <label className="label"><span className="label-text">Jam Tutup</span></label>
          <input type="time" className="input input-bordered w-full" name="closehour" value={form.closehour} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Kategori Tenant</span></label>
        <select className="select select-bordered w-full" name="tenantCategoryId" value={form.tenantCategoryId} onChange={handleChange} required>
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Deskripsi Singkat</span></label>
        <textarea className="textarea textarea-bordered w-full" name="description" value={form.description} onChange={handleChange} />
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Upload Foto Tenant</span></label>
        <input type="file" className="file-input file-input-bordered w-full" name="imageFile" accept="image/*" onChange={handleFileChange} />
        {imageFile && <span className="text-xs mt-1">{imageFile.name}</span>}
      </div>
      <div className="form-control">
        <label className="label"><span className="label-text">Upload QRIS (opsional)</span></label>
        <input type="file" className="file-input file-input-bordered w-full" name="qrisFile" accept="image/*" onChange={handleFileChange} />
        {qrisFile && <span className="text-xs mt-1">{qrisFile.name}</span>}
      </div>
      {error && <div className="alert alert-error py-2 px-4 text-sm">{error}</div>}
      {success && <div className="alert alert-success py-2 px-4 text-sm">{success}</div>}
      <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Tenant"}
      </button>
    </form>
  );
};

export default AddTenant;
