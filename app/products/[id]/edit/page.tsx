"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProduct, getCategories, updateProduct } from "@/lib/api";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [specsText, setSpecsText] = useState("{}");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [product, cats] = await Promise.all([
        getProduct(id),
        getCategories(),
      ]);
      setName(product.name);
      setBrand(product.brand);
      setCategoryId(product.categoryId);
      setPrice(String(product.price));
      setSpecsText(JSON.stringify(product.specs, null, 2));
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let specs;
    try {
      specs = JSON.parse(specsText);
    } catch {
      setError("Specs alanı geçerli bir JSON olmalı.");
      return;
    }

    await updateProduct(id, {
      name,
      brand,
      categoryId,
      price: Number(price),
      priceMax: Number(price),
      specs,
    });

    router.push("/");
  }

  if (loading) return <main className="p-8">Yükleniyor...</main>;

  return (
    <main className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Ürünü Düzenle</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Ürün Adı</label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Marka</label>
          <input
            className="border p-2 w-full rounded"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Kategori</label>
          <select
            className="border p-2 w-full rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Fiyat (₺)</label>
          <input
            type="number"
            className="border p-2 w-full rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Özellikler (JSON formatında)</label>
          <textarea
            className="border p-2 w-full rounded font-mono text-sm"
            rows={8}
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Değişiklikleri Kaydet
        </button>
      </form>
    </main>
  );
}