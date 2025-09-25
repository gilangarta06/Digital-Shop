"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Kelola Akun Premium</h1>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className={`space-y-4 rounded-lg border p-4 ${
          editingId ? "border-yellow-400" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {/* Produk */}
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Produk" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Varian */}
          <Select value={variantName} onValueChange={setVariantName} disabled={!variants.length}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Varian" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v: any, idx: number) => (
                <SelectItem key={idx} value={v.name}>
                  {v.name} - Rp{v.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : editingId ? "Update Akun" : "Tambah Akun"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setProductId("");
                setVariantName("");
                setUsername("");
                setPassword("");
              }}
            >
              Batal
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Varian</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length ? (
              accounts.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.product_id?.name}</TableCell>
                  <TableCell>{a.variant_name}</TableCell>
                  <TableCell>{a.username}</TableCell>
                  <TableCell>{a.password}</TableCell>
                  <TableCell>
                    {a.is_sold ? (
                      <Badge variant="destructive">Terjual</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                        Tersedia
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => startEdit(a)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(a._id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Belum ada akun.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
