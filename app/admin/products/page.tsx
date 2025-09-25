"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type VariantAccount = { username: string; password: string };
type Variant = { name: string; price: number; stock: number; accounts?: VariantAccount[] };

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
  const [variants, setVariants] = useState<Variant[]>([
    { name: "", price: 0, stock: 0, accounts: [] },
  ]);

  // === Fetch Produk ===
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // === Helpers ===
  const ensureAccountsLength = (acctList: VariantAccount[] = [], target: number) => {
    const result = [...acctList];
    if (result.length < target) {
      for (let i = result.length; i < target; i++) result.push({ username: "", password: "" });
    } else if (result.length > target) {
      result.splice(target);
    }
    return result;
  };

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { name: "", price: 0, stock: 0, accounts: [] }]);
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        const next = { ...v };
        if (field === "price" || field === "stock") {
          const num = Number(value || 0);
          next[field] = num;
          if (field === "stock") {
            next.accounts = ensureAccountsLength(next.accounts || [], num);
          }
        } else {
          // @ts-ignore
          next[field] = value;
        }
        return next;
      })
    );
  };

  const handleVariantAccountChange = (
    variantIndex: number,
    accIndex: number,
    field: keyof VariantAccount,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        const accounts = [...(v.accounts || [])];
        for (let k = accounts.length; k <= accIndex; k++) accounts.push({ username: "", password: "" });
        accounts[accIndex] = { ...accounts[accIndex], [field]: value };
        return { ...v, accounts };
      })
    );
  };

  const handleRemoveVariantAccount = (variantIndex: number, accIndex: number) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        const accounts = [...(v.accounts || [])];
        accounts.splice(accIndex, 1);
        return { ...v, accounts, stock: accounts.length };
      })
    );
  };

  // === CRUD ===
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, image, description, variants }),
    });

    // reset form
    setName("");
    setCategory("");
    setImage("");
    setDescription("");
    setVariants([{ name: "", price: 0, stock: 0, accounts: [] }]);

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

  // === Filter Produk ===
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // === Render ===
  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-400">Memuat data...</p>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kelola Produk</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" /> Tambah Produk
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border">
        <Search className="text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 focus-visible:ring-0"
        />
      </div>

      {/* Produk */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Tidak ada produk ditemukan.</p>
        ) : (
          filteredProducts.map((p) => (
            <Card
              key={p._id}
              className="p-4 border shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.image || "/placeholder.png"}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.category}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setEditing(p)}>
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(p._id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Hapus
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal Tambah Produk */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Produk</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <Label>Nama Produk</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
              <Label>Link Gambar</Label>
              <Input value={image} onChange={(e) => setImage(e.target.value)} required />
            </div>
            <div>
              <Label>Deskripsi</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Varian */}
            <h3 className="font-semibold">Varian Produk</h3>
            {variants.map((variant, vIndex) => (
              <div key={vIndex} className="p-2 border rounded-lg space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Nama Varian"
                    value={variant.name}
                    onChange={(e) => handleVariantChange(vIndex, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Harga"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(vIndex, "price", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Stok"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {(variant.accounts || []).map((acc, aIndex) => (
                    <div key={aIndex} className="grid grid-cols-3 gap-2">
                      <Input
                        placeholder="Username"
                        value={acc.username}
                        onChange={(e) =>
                          handleVariantAccountChange(vIndex, aIndex, "username", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Password"
                        value={acc.password}
                        onChange={(e) =>
                          handleVariantAccountChange(vIndex, aIndex, "password", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveVariantAccount(vIndex, aIndex)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={handleAddVariant}>
              <Plus className="w-4 h-4 mr-1" /> Tambah Varian
            </Button>

            <DialogFooter>
              <Button type="submit">Simpan Produk & Akun</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Edit Produk */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label>Nama Produk</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <Input
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <h3 className="font-semibold">Edit Varian</h3>
              <div className="space-y-2">
                {editing.variants?.map((variant: Variant, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 border p-2 rounded-lg"
                  >
                    <Input
                      value={variant.name}
                      onChange={(e) => {
                        const updated = [...editing.variants];
                        updated[index].name = e.target.value;
                        setEditing({ ...editing, variants: updated });
                      }}
                    />
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) => {
                        const updated = [...editing.variants];
                        updated[index].price = Number(e.target.value);
                        setEditing({ ...editing, variants: updated });
                      }}
                    />
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => {
                        const updated = [...editing.variants];
                        updated[index].stock = Number(e.target.value);
                        setEditing({ ...editing, variants: updated });
                      }}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
