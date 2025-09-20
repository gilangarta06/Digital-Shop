'use client';

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

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

    setName("");
    setCategory("");
    setImage("");
    setDescription("");
    setVariants([{ name: "", price: 0, stock: 0 }]);

    fetchProducts();
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Kelola Produk
      </h1>

      {/* Form Tambah Produk */}
      <form
        onSubmit={handleAddProduct}
        className="space-y-4 border border-gray-300 dark:border-gray-700 p-6 rounded-xl mb-8 bg-white dark:bg-gray-800 shadow-md"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Tambah Produk Baru
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="text"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Link Gambar"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <textarea
          placeholder="Deskripsi Produk"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />

        {/* Varian */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Varian Produk
        </h3>
        {variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="Nama Varian"
              value={variant.name}
              onChange={(e) =>
                handleVariantChange(index, "name", e.target.value)
              }
              className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Harga"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", Number(e.target.value))
              }
              className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Stok"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", Number(e.target.value))
              }
              className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Varian
        </button>

        <button
          type="submit"
          className="block w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow-md transition"
        >
          Simpan Produk
        </button>
      </form>

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
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Edit Produk */}
      {editing && (
        <form
          onSubmit={handleUpdate}
          className="space-y-4 border border-yellow-300 dark:border-yellow-600 p-6 rounded-xl mt-6 bg-yellow-50 dark:bg-yellow-900 shadow-md"
        >
          <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100">
            Edit Produk
          </h2>

          <input
            type="text"
            value={editing.name}
            onChange={(e) =>
              setEditing({ ...editing, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="text"
            value={editing.category}
            onChange={(e) =>
              setEditing({ ...editing, category: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <textarea
            value={editing.description || ""}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />

          <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
            Edit Varian
          </h3>
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
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => {
                  const newVariants = [...editing.variants];
                  newVariants[index].price = Number(e.target.value);
                  setEditing({ ...editing, variants: newVariants });
                }}
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => {
                  const newVariants = [...editing.variants];
                  newVariants[index].stock = Number(e.target.value);
                  setEditing({ ...editing, variants: newVariants });
                }}
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
          >
            Simpan Perubahan
          </button>
        </form>
      )}
    </div>
  );
}
