"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Search, X } from "lucide-react";

type Variant = { name: string; price: number; stock: number };

export default function DashboardProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState<Variant[]>([{ name: "", price: 0, stock: 0 }]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { name: "", price: 0, stock: 0 }]);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, [field]: field === "price" || field === "stock" ? Number(value) : String(value) }
          : v
      )
    );
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, image, description, variants }),
    });

    setName("");
    setCategory("");
    setImage("");
    setDescription("");
    setVariants([{ name: "", price: 0, stock: 0 }]);
    setIsAddModalOpen(false);

    fetchProducts();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    await fetch(`/api/products/${editing._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    setEditing(null);
    fetchProducts();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Memuat data...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Produk</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Produk */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Tidak ada produk ditemukan.</p>
        ) : (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{p.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{p.category}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <Modal title="Tambah Produk" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <Input label="Nama Produk" value={name} onChange={setName} required />
            <Input label="Kategori" value={category} onChange={setCategory} required />
            <Input label="Link Gambar" value={image} onChange={setImage} required />
            <Textarea label="Deskripsi" value={description} onChange={setDescription} />

            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Varian Produk</h3>
            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 border p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <input type="text" placeholder="Nama Varian" value={variant.name} onChange={(e) => handleVariantChange(index, "name", e.target.value)} className="input" />
                  <input type="number" placeholder="Harga" value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} className="input" />
                  <input type="number" placeholder="Stok" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="input" />
                </div>
              ))}
            </div>

            <button type="button" onClick={handleAddVariant} className="btn-secondary">
              <Plus className="w-4 h-4" /> Tambah Varian
            </button>

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">Simpan</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit */}
      {editing && (
        <Modal title="Edit Produk" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input label="Nama Produk" value={editing.name} onChange={(val) => setEditing({ ...editing, name: val })} />
            <Input label="Kategori" value={editing.category} onChange={(val) => setEditing({ ...editing, category: val })} />
            <Textarea label="Deskripsi" value={editing.description || ""} onChange={(val) => setEditing({ ...editing, description: val })} />

            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Edit Varian</h3>
            <div className="space-y-2">
              {editing.variants?.map((variant: Variant, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-2 border p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <input type="text" value={variant.name} onChange={(e) => {
                    const updated = [...editing.variants];
                    updated[index].name = e.target.value;
                    setEditing({ ...editing, variants: updated });
                  }} className="input" />
                  <input type="number" value={variant.price} onChange={(e) => {
                    const updated = [...editing.variants];
                    updated[index].price = Number(e.target.value);
                    setEditing({ ...editing, variants: updated });
                  }} className="input" />
                  <input type="number" value={variant.stock} onChange={(e) => {
                    const updated = [...editing.variants];
                    updated[index].stock = Number(e.target.value);
                    setEditing({ ...editing, variants: updated });
                  }} className="input" />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary">Batal</button>
              <button type="submit" className="btn-primary">Simpan Perubahan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* Komponen Reusable */
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-lg relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required }: { label: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500" />
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500" />
    </div>
  );
}
