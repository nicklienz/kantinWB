import { useEffect, useState } from "react";
import { useSupabase } from "@/app/auth/provider";
import type { MenuItem } from "@/types/menu.types";

export default function AddMenuBundle() {
  const supabase = useSupabase();
  const [tenantName, setTenantName] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null as File | null,
    items: [] as string[], // menu item ids
  });
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
    if (!tenantName) return;
    const fetchItems = async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("id, name, price, category, uom, uom_value, stock, image_url")
        .eq("tenant_name", tenantName)
        .order("name");
      setItems(data || []);
    };
    fetchItems();
  }, [tenantName, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files, checked } = e.target as any;
    if (name === "imageFile") {
      setForm({ ...form, imageFile: files[0] });
    } else if (name === "items") {
      if (checked) setForm({ ...form, items: [...form.items, value] });
      else setForm({ ...form, items: form.items.filter((id) => id !== value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!form.name || !form.price || form.items.length === 0) {
      setError("Nama, harga, dan minimal 1 menu harus diisi.");
      setLoading(false);
      return;
    }
    let imageUrl = null;
    if (form.imageFile) {
      const ext = form.imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: imgErr } = await supabase.storage.from("menu-images").upload(`bundles/${fileName}`, form.imageFile, { upsert: true });
      if (imgErr) {
        setError("Gagal upload gambar: " + imgErr.message);
        setLoading(false);
        return;
      }
      const { data: publicUrl } = supabase.storage.from("menu-images").getPublicUrl(`bundles/${fileName}`);
      imageUrl = publicUrl.publicUrl;
    }
    const { error } = await supabase.from("menu_bundles").insert({
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image_url: imageUrl,
      items: form.items,
    });
    if (error) setError(error.message);
    else setSuccess("Bundle berhasil ditambahkan.");
    setForm({ name: "", price: "", description: "", imageFile: null, items: [] });
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">Tambah Bundle Menu</h3>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4" onSubmit={handleSubmit}>
        <input type="text" className="input input-bordered w-full" name="name" placeholder="Nama Bundle" value={form.name} onChange={handleChange} required />
        <input type="number" className="input input-bordered w-full" name="price" placeholder="Harga Bundle" value={form.price} onChange={handleChange} min={0} required />
        <textarea className="textarea textarea-bordered w-full col-span-1 sm:col-span-2" name="description" placeholder="Deskripsi (opsional)" value={form.description} onChange={handleChange} />
        <input type="file" className="file-input file-input-bordered w-full" name="imageFile" accept="image/*" onChange={handleChange} />
        <div className="col-span-1 sm:col-span-2">
          <div className="font-semibold mb-1">Pilih Menu</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {items.map((item) => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  name="items"
                  value={item.id}
                  checked={form.items.includes(item.id)}
                  onChange={handleChange}
                />
                <span>{item.name}</span>
                <span className="badge badge-info badge-xs">Rp {item.price.toLocaleString("id-ID")}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary w-full sm:w-auto mt-2" type="submit" disabled={loading}>
          Tambah Bundle
        </button>
      </form>
      {error && <div className="alert alert-error py-2 px-4 text-sm mb-2">{error}</div>}
      {success && <div className="alert alert-success py-2 px-4 text-sm mb-2">{success}</div>}
    </div>
  );
}
