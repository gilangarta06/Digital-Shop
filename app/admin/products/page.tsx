'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Search, X } from "lucide-react";

type Variant = { name: string; price: number; stock: number };

export default function DashboardProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // Form Tambah Produk
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
          ? {
              ...v,
              [field]: field === "price" || field === "stock" ? Number(value) : String(value),
            }
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

    // Reset form
    setName("");
    setCategory("");
    setImage("");
    setDescription("");
    setVariants([{ name: "", price: 0, stock: 0 }]);
    setIsAddModalOpen(false);

    fetchProducts();
  };

  const handleEditVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    if (!editing) return;
    setEditing((prev: any) => ({
      ...prev,
      variants: prev.variants.map((v: Variant, i: number) =>
        i === index
          ? {
              ...v,
              [field]: field === "price" || field === "stock" ? Number(value) : String(value),
            }
          : v
      ),
    }));
  };

  const handleAddEditVariant = () => {
    if (!editing) return;
    setEditing((prev: any) => ({
      ...prev,
      variants: [...prev.variants, { name: "", price: 0, stock: 0 }],
    }));
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

  if (loading)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Kelola Produk
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      {/* Search / Filter */}
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Tabel Produk */}
      <div className="overflow-x-auto border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada produk ditemukan
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL Tambah Produk */}
      {isAddModalOpen && (
        <Modal title="Tambah Produk" onClose={() => setIsAddModalOpen(false)}>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            <input type="text" placeholder="Kategori" value={category} onChange={(e) => setCategory(e.target.value)} className="input" required />
            <input type="text" placeholder="Link Gambar" value={image} onChange={(e) => setImage(e.target.value)} className="input" required />
            <textarea placeholder="Deskripsi Produk" value={description} onChange={(e) => setDescription(e.target.value)} className="input" />

            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Varian Produk</h3>
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input type="text" placeholder="Nama Varian" value={variant.name} onChange={(e) => handleVariantChange(index, "name", e.target.value)} className="input" />
                <input type="number" placeholder="Harga" value={variant.price} onChange={(e) => handleVariantChange(index, "price", e.target.value)} className="input" />
                <input type="number" placeholder="Stok" value={variant.stock} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="input" />
              </div>
            ))}

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

      {/* MODAL Edit Produk */}
      {editing && (
        <Modal title="Edit Produk" onClose={() => setEditing(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" />
            <input type="text" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="input" />
            <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input" />

            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Edit Varian</h3>
            {editing.variants?.map((variant: Variant, index: number) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <input type="text" value={variant.name} onChange={(e) => handleEditVariantChange(index, "name", e.target.value)} className="input" />
                <input type="number" value={variant.price} onChange={(e) => handleEditVariantChange(index, "price", e.target.value)} className="input" />
                <input type="number" value={variant.stock} onChange={(e) => handleEditVariantChange(index, "stock", e.target.value)} className="input" />
              </div>
            ))}
            <button type="button" onClick={handleAddEditVariant} className="btn-secondary">
              <Plus className="w-4 h-4" /> Tambah Varian
            </button>

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

// Reusable Modal Component
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
}
