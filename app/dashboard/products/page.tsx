'use client';

import { useState, useEffect } from "react";

export default function DashboardProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  // Form Tambah Produk
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([{ name: "", price: 0, stock: 0 }]);

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

  const handleEdit = (product: any) => {
    // set edit form, tanpa ganggu form tambah
    setEditing({ ...product });
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

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", price: 0, stock: 0 }]);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, image, description, variants }),
    });

    // ✅ Reset semua field tambah produk
    setName("");
    setCategory("");
    setImage("");
    setDescription("");
    setVariants([{ name: "", price: 0, stock: 0 }]);

    fetchProducts();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kelola Produk</h1>

      {/* Form Tambah Produk */}
      <form
        onSubmit={handleAddProduct}
        className="space-y-4 border p-4 rounded mb-8 bg-gray-50"
      >
        <h2 className="text-xl font-semibold">Tambah Produk Baru</h2>
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Link Gambar"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Deskripsi Produk"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <h3 className="font-semibold">Varian Produk</h3>
        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nama Varian (cth: 1 Bulan)"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Harga (Rp)"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", Number(e.target.value))
              }
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", Number(e.target.value))
              }
              className="p-2 border rounded"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          + Tambah Varian
        </button>

        <button
          type="submit"
          className="block w-full bg-green-600 text-white py-2 rounded mt-4"
        >
          Simpan Produk
        </button>
      </form>

      {/* Tabel Produk */}
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nama</th>
            <th className="border p-2">Kategori</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Edit Produk */}
      {editing && (
        <form
          onSubmit={handleUpdate}
          className="space-y-4 border p-4 rounded bg-yellow-50"
        >
          <h2 className="text-xl font-semibold">Edit Produk</h2>

          <input
            type="text"
            value={editing.name}
            onChange={(e) =>
              setEditing({ ...editing, name: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={editing.category}
            onChange={(e) =>
              setEditing({ ...editing, category: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <textarea
            value={editing.description || ""}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <h3 className="font-semibold">Edit Varian</h3>
          {editing.variants?.map((variant: any, index: number) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={variant.name}
                onChange={(e) => {
                  const newVariants = [...editing.variants];
                  newVariants[index].name = e.target.value;
                  setEditing({ ...editing, variants: newVariants });
                }}
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const newVariants = [...editing.variants];
                  newVariants[index].price = Number(e.target.value);
                  setEditing({ ...editing, variants: newVariants });
                }}
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => {
                  const newVariants = [...editing.variants];
                  newVariants[index].stock = Number(e.target.value);
                  setEditing({ ...editing, variants: newVariants });
                }}
                className="p-2 border rounded"
              />
            </div>
          ))}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan Perubahan
          </button>
        </form>
      )}
    </div>
  );
}
