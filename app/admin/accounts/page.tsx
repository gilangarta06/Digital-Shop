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

  // Ambil akun dari API
  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error("Gagal ambil akun:", error);
    }
  };

  // Ambil produk dari API
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

  // Update varian ketika produk berubah
  useEffect(() => {
    const p = products.find((p) => p._id === productId);
    setVariants(p?.variants || []);
  }, [productId, products]);

  // Simpan akun (Tambah atau Update)
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
    } catch (error) {
      alert("⚠️ Gagal menyimpan akun!");
    } finally {
      setLoading(false);
    }
  };

  // Hapus akun
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus akun ini?")) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus akun");
      fetchAccounts();
    } catch (error) {
      alert("❌ Gagal hapus akun");
    }
  };

  // Masuk ke mode edit
  const startEdit = (a: any) => {
    setEditingId(a._id);
    setProductId(a.product_id?._id || "");
    setVariantName(a.variant_name);
    setUsername(a.username);
    setPassword(a.password);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Akun Premium</h1>

      {/* Form Tambah/Edit */}
      <form onSubmit={handleSave} className="mb-6 space-y-3">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="border p-2 rounded w-full"
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
          className="border p-2 rounded w-full"
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
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
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
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Batal
          </button>
        )}
      </form>

      {/* Table akun */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Produk</th>
            <th className="p-2 border">Varian</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Password</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length ? (
            accounts.map((a) => (
              <tr key={a._id}>
                <td className="p-2 border">{a.product_id?.name}</td>
                <td className="p-2 border">{a.variant_name}</td>
                <td className="p-2 border">{a.username}</td>
                <td className="p-2 border">{a.password}</td>
                <td className="p-2 border">
                  {a.is_sold ? "✅ Terjual" : "🟢 Tersedia"}
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => startEdit(a)}
                    className="px-2 py-1 bg-yellow-400 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-2 py-1 bg-red-500 rounded text-white"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Belum ada akun.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
