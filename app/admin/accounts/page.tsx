"use client";

import { useState, useEffect } from "react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [productId, setProductId] = useState("");
  const [variantName, setVariantName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Gagal ambil akun:", error);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal ambil produk:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchProducts();
  }, []);

  // Update variants on product change
  useEffect(() => {
    const p = products.find((p) => p._id === productId);
    setVariants(p?.variants || []);
  }, [productId, products]);

  // Save (Add or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = { product_id: productId, variant_name: variantName, username, password };
    try {
      const res = await fetch(editingId ? `/api/accounts/${editingId}` : "/api/accounts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("❌ Gagal: " + err.error);
        return;
      }

      setProductId("");
      setVariantName("");
      setUsername("");
      setPassword("");
      setEditingId(null);
      fetchAccounts();
      alert(editingId ? "✅ Akun berhasil diupdate!" : "✅ Akun berhasil ditambahkan!");
    } catch {
      alert("⚠️ Gagal menyimpan akun!");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus akun ini?")) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus akun");
      fetchAccounts();
    } catch {
      alert("❌ Gagal hapus akun");
    }
  };

  // Edit mode
  const startEdit = (a: any) => {
    setEditingId(a._id);
    setProductId(a.product_id?._id || "");
    setVariantName(a.variant_name);
    setUsername(a.username);
    setPassword(a.password);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kelola Akun Premium</h1>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className={`mb-8 p-4 rounded-lg shadow bg-white dark:bg-gray-900 space-y-3 transition-all ${
          editingId ? "border border-yellow-400" : "border border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 dark:bg-gray-800"
          >
            <option value="">Pilih Produk</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={variantName}
            onChange={(e) => setVariantName(e.target.value)}
            required
            disabled={!variants.length}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 dark:bg-gray-800"
          >
            <option value="">Pilih Varian</option>
            {variants.map((v: any, idx: number) => (
              <option key={idx} value={v.name}>
                {v.name} - Rp{v.price}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 dark:bg-gray-800"
            required
          />

          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 dark:bg-gray-800"
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : editingId ? "Update Akun" : "Tambah Akun"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setProductId("");
                setVariantName("");
                setUsername("");
                setPassword("");
              }}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-3">Produk</th>
              <th className="p-3">Varian</th>
              <th className="p-3">Username</th>
              <th className="p-3">Password</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length ? (
              accounts.map((a, idx) => (
                <tr
                  key={a._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <td className="p-3">{a.product_id?.name}</td>
                  <td className="p-3">{a.variant_name}</td>
                  <td className="p-3">{a.username}</td>
                  <td className="p-3">{a.password}</td>
                  <td className="p-3">
                    {a.is_sold ? (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200">
                        Terjual
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                        Tersedia
                      </span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => startEdit(a)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  Belum ada akun.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
