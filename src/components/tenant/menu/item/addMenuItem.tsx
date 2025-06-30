import Image from "next/image";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/auth/provider";
import type { MenuItem, MenuVariant } from "@/types/menu.types";
import { UOM } from "@/types/menu.types";

export default function AddMenuItem() {
  const supabase = useSupabase();
  const [tenantName, setTenantName] = useState<string>("");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [variants, setVariants] = useState<Record<string, MenuVariant[]>>({});
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    uom: "",
    uom_value: "",
    stock: "",
    imageFile: null as File | null,
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const uomOptions = Object.values(UOM);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, name, price, category, uom, uom_value, stock, image_url, isAvailable")
      .eq("tenant_name", tenantName)
      .order("name");
    if (error) setError(error.message);
    setItems(
      (data || []).map((item): MenuItem => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        uom: item.uom,
        uomValue: item.uom_value,
        stock: item.stock,
        imageUrl: item.image_url,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      }))
    );
    setLoading(false);
    // Fetch variants for all items
    if (data) {
      const ids = data.map((item) => item.id);
      if (ids.length > 0) {
        const { data: vdata } = await supabase
          .from("menu_variants")
          .select("id, name, price, menu_item_id");
        const grouped: Record<string, MenuVariant[]> = {};
        (vdata || []).forEach((v) => {
          const variant: MenuVariant = {
            id: v.id,
            name: v.name,
            price: v.price
          };
          if (!grouped[v.menu_item_id]) grouped[v.menu_item_id] = [];
          grouped[v.menu_item_id].push(variant);
        });
        setVariants(grouped);
      }
    }
  };

  useEffect(() => {
    const fetchTenantName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("tenant")
        .select("name")
        .eq("email", user.email)
        .single();
      if (data && data.name) setTenantName(data.name);
    };
    fetchTenantName();
  }, [supabase]);

  useEffect(() => {
    if (tenantName) fetchItems();
    // eslint-disable-next-line
  }, [tenantName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!form.name || !form.price || !form.uom || !form.uom_value || !form.stock) {
      setError("Nama, harga, satuan, nilai satuan, dan stok harus diisi.");
      setLoading(false);
      return;
    }
    let imageUrl = null;
    if (form.imageFile) {
      const ext = form.imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: imgErr } = await supabase.storage.from("menu-images").upload(`images/${fileName}`, form.imageFile, { upsert: true });
      if (imgErr) {
        setError("Gagal upload gambar: " + imgErr.message);
        setLoading(false);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("menu-images").getPublicUrl(`images/${fileName}`);
      imageUrl = publicUrl.publicUrl;
    }
    if (editId) {
      // Update
      const { error } = await supabase
        .from("menu_items")
        .update({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          uom: form.uom,
          uom_value: Number(form.uom_value),
          stock: Number(form.stock),
          image_url: imageUrl || undefined,
        })
        .eq("id", editId);
      if (error) setError(error.message);
      else setSuccess("Menu berhasil diupdate.");
    } else {
      // Insert
      const { error } = await supabase
        .from("menu_items")
        .insert({
          name: form.name,
          price: Number(form.price),
          category: form.category,
          uom: form.uom,
          uom_value: Number(form.uom_value),
          stock: Number(form.stock),
          image_url: imageUrl,
          tenant_name: tenantName,
        });
      if (error) setError(error.message);
      else setSuccess("Menu berhasil ditambahkan.");
    }
    setForm({ name: "", price: "", category: "", uom: "", uom_value: "", stock: "", imageFile: null });
    setEditId(null);
    await fetchItems();
    setLoading(false);
  };

  const handleEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category || "",
      uom: item.uom,
      uom_value: item.uomValue.toString(),
      stock: item.stock.toString(),
      imageFile: null,
    });
    setEditId(item.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus menu ini?")) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) setError(error.message);
    else setSuccess("Menu berhasil dihapus.");
    await fetchItems();
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Kelola Menu</h3>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" onSubmit={handleSubmit}>
        <input type="text" className="input input-bordered w-full" name="name" placeholder="Nama Menu" value={form.name} onChange={handleChange} required />
        <input type="number" className="input input-bordered w-full" name="price" placeholder="Harga" value={form.price} onChange={handleChange} min={0} required />
        <input type="text" className="input input-bordered w-full" name="category" placeholder="Kategori" value={form.category} onChange={handleChange} />
        <select className="select select-bordered w-full" name="uom" value={form.uom} onChange={handleChange} required>
          <option value="">Pilih Satuan</option>
          {uomOptions.map(uom => (
            <option key={uom} value={uom}>{uom}</option>
          ))}
        </select>
        <input type="number" className="input input-bordered w-full" name="uom_value" placeholder="Nilai Satuan (ex: 1)" value={form.uom_value} onChange={handleChange} min={1} required />
        <input type="number" className="input input-bordered w-full" name="stock" placeholder="Stok" value={form.stock} onChange={handleChange} min={0} required />
        <input type="file" className="file-input file-input-bordered w-full" name="imageFile" accept="image/*" onChange={handleChange} />
        <button className="btn btn-primary w-full sm:w-auto" type="submit" disabled={loading}>
          {editId ? "Simpan Perubahan" : "Tambah Menu"}
        </button>
        {editId && (
          <button type="button" className="btn btn-ghost w-full sm:w-auto" onClick={() => { setForm({ name: "", price: "", category: "", uom: "", uom_value: "", stock: "", imageFile: null }); setEditId(null); }}>
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
              <th>Nama Menu</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th>Satuan</th>
              <th>Stok</th>
              <th>Gambar</th>
              <th>Varian</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9}><span className="loading loading-spinner loading-md"></span></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={9} className="text-center">Belum ada menu</td></tr>
            ) : (
              items.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>Rp {item.price.toLocaleString("id-ID")}</td>
                  <td>{item.category}</td>
                  <td>{item.uom} ({item.uomValue})</td>
                  <td>{item.stock}</td>
                  <td>{item.imageUrl ? <Image src={item.imageUrl} alt="menu" className="w-12 h-12 rounded object-cover" /> : <span className="text-xs">-</span>}</td>
                  <td>
                    {variants[item.id]?.length ? (
                      <ul className="list">
                        {variants[item.id].map(v => (
                          <li className="list-row flex justify-between" key={v.id}>
                            <span>{v.name}</span>
                            <span className="badge badge-info badge-xs">Rp {v.price.toLocaleString("id-ID")}</span>
                          </li>
                        ))}
                      </ul>
                    ) : <span className="text-xs">-</span>}
                  </td>
                  <td className="flex gap-2">
                    <button className="btn btn-xs btn-info" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => handleDelete(item.id)}>Hapus</button>
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
